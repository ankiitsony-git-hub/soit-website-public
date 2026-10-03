"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize2,
  Minimize2,
  LayoutGrid,
  X,
  ArrowLeft,
  BookOpen,
  Loader2,
  HelpCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface MagazineFlipbookProps {
  pdfUrl: string;
  title?: string;
  subtitle?: string;
  initialPage?: number;
}

export default function MagazineFlipbook({
  pdfUrl,
  title = "BODHIKA",
  subtitle = "The SoIT Gazette • 2025-26",
  initialPage = 1,
}: MagazineFlipbookProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<any>(null);
  const pdfDocRef = useRef<any>(null);

  // States
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(Math.max(0, initialPage - 1)); // 0-indexed in page-flip
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<string>("Initializing reader...");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showThumbnails, setShowThumbnails] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [renderedThumbnails, setRenderedThumbnails] = useState<{ [page: number]: string }>({});
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showNav, setShowNav] = useState<boolean>(true);

  const hideNavTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger navbar visibility on user click, scroll, mouse move, or keypress
  const triggerNavVisibility = useCallback(() => {
    setShowNav(true);
    if (hideNavTimerRef.current) {
      clearTimeout(hideNavTimerRef.current);
    }
    hideNavTimerRef.current = setTimeout(() => {
      // Don't auto-hide if thumbnail drawer or help modal is open
      setShowNav(false);
    }, 3200);
  }, []);

  // Set up listeners for user click, scroll, wheel, mousemove
  useEffect(() => {
    const handleActivity = () => {
      triggerNavVisibility();
    };

    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("wheel", handleActivity, { passive: true });
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("touchstart", handleActivity, { passive: true });

    // Initial timeout to hide after first load
    hideNavTimerRef.current = setTimeout(() => {
      setShowNav(false);
    }, 4000);

    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("wheel", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      if (hideNavTimerRef.current) {
        clearTimeout(hideNavTimerRef.current);
      }
    };
  }, [triggerNavVisibility]);

  // Track rendered canvas pages to avoid duplicate render
  const renderedPagesRef = useRef<Set<number>>(new Set());

  // Render a specific PDF page to canvas
  const renderPageToCanvas = useCallback(
    async (pageNum: number, targetCanvas: HTMLCanvasElement, scaleMultiplier = 1.5) => {
      if (!pdfDocRef.current) return;
      try {
        const page = await pdfDocRef.current.getPage(pageNum);
        const viewport = page.getViewport({ scale: scaleMultiplier });

        targetCanvas.width = viewport.width;
        targetCanvas.height = viewport.height;
        const ctx = targetCanvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetCanvas.width, targetCanvas.height);

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;
      } catch (err) {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    },
    []
  );

  // Initialize PDF & PageFlip
  useEffect(() => {
    let isCancelled = false;

    async function initReader() {
      try {
        setIsLoading(true);
        setLoadingProgress("Loading PDF engine...");

        // Dynamically import pdfjs-dist
        const pdfjsLib = await import("pdfjs-dist");

        // Configure local worker for instant startup without external CDN latency
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        setLoadingProgress("Fetching magazine data...");

        // Fetch PDF as arrayBuffer to guarantee exact byte length and prevent Range request offset mismatch on static dev servers
        const response = await fetch(pdfUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const contentLength = +(response.headers.get("Content-Length") || 0);
        let arrayBuffer: ArrayBuffer;

        if (response.body && contentLength > 0) {
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let receivedLength = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              receivedLength += value.length;
              const pct = Math.min(99, Math.round((receivedLength / contentLength) * 100));
              setLoadingProgress(`Loading publication (${pct}%)...`);
            }
          }

          const combined = new Uint8Array(receivedLength);
          let pos = 0;
          for (const chunk of chunks) {
            combined.set(chunk, pos);
            pos += chunk.length;
          }
          arrayBuffer = combined.buffer;
        } else {
          arrayBuffer = await response.arrayBuffer();
        }

        if (isCancelled) return;
        setLoadingProgress("Parsing publication pages...");

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          cMapPacked: true,
          isEvalSupported: false,
        });

        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;
        pdfDocRef.current = pdfDoc;
        const numPages = pdfDoc.numPages;
        setTotalPages(numPages);

        setLoadingProgress("Generating 3D Flipbook...");

        // Calculate dimensions based on viewport
        const isMobile = window.innerWidth < 768;
        const containerWidth = Math.min(window.innerWidth * 0.96, 1600);
        const containerHeight = Math.min(window.innerHeight * 0.88, 1050);

        let singlePageWidth: number;
        let singlePageHeight: number;

        if (isMobile) {
          singlePageWidth = Math.min(window.innerWidth * 0.94, 520);
          singlePageHeight = singlePageWidth * 1.414;
          if (singlePageHeight > containerHeight) {
            singlePageHeight = containerHeight;
            singlePageWidth = singlePageHeight / 1.414;
          }
        } else {
          // Double page view - expanded for larger book sizing
          const doubleWidth = containerWidth;
          singlePageWidth = Math.min((doubleWidth - 20) / 2, 720);
          singlePageHeight = singlePageWidth * 1.414;
          if (singlePageHeight > containerHeight) {
            singlePageHeight = containerHeight;
            singlePageWidth = singlePageHeight / 1.414;
          }
        }

        // Import PageFlip dynamically
        const { PageFlip } = await import("page-flip");
        if (isCancelled || !bookRef.current) return;

        // Clear existing book contents
        bookRef.current.innerHTML = "";

        // Create page container divs
        for (let i = 1; i <= numPages; i++) {
          const pageDiv = document.createElement("div");
          pageDiv.className = "page bg-white overflow-hidden select-none shadow-md flex items-center justify-center";
          pageDiv.dataset.density = i === 1 || i === numPages ? "hard" : "soft";

          const canvas = document.createElement("canvas");
          canvas.id = `page-canvas-${i}`;
          canvas.className = "w-full h-full object-contain block";

          // Placeholder loading spinner
          const loaderDiv = document.createElement("div");
          loaderDiv.id = `page-loader-${i}`;
          loaderDiv.className = "absolute inset-0 flex flex-col items-center justify-center bg-slate-100/80 z-10 transition-opacity duration-300";
          loaderDiv.innerHTML = `
            <div class="animate-spin rounded-full h-8 w-8 border-3 border-indigo-900 border-t-transparent"></div>
            <span class="mt-2 text-xs font-medium text-slate-500">Page ${i}</span>
          `;

          pageDiv.appendChild(loaderDiv);
          pageDiv.appendChild(canvas);
          bookRef.current.appendChild(pageDiv);
        }

        // Initialize PageFlip instance with larger limits
        const pageFlip = new PageFlip(bookRef.current, {
          width: Math.round(singlePageWidth),
          height: Math.round(singlePageHeight),
          size: "fixed",
          minWidth: 320,
          maxWidth: 900,
          minHeight: 450,
          maxHeight: 1250,
          drawShadow: true,
          flippingTime: 600,
          usePortrait: isMobile,
          startZIndex: 0,
          autoSize: false,
          maxShadowOpacity: 0.45,
          showCover: true,
          mobileScrollSupport: false,
          swipeDistance: 30,
        });

        pageFlip.loadFromHTML(bookRef.current.querySelectorAll(".page"));
        pageFlipInstance.current = pageFlip;
        setPageWidth(Math.round(singlePageWidth));
        setIsMobileView(isMobile);

        // Event listeners
        pageFlip.on("flip", (e: { data: number }) => {
          setCurrentPage(e.data);
          // Pre-render surrounding pages asynchronously
          renderVisiblePages(e.data, numPages);
        });

        pageFlip.on("changeState", (e: { data: string }) => {
          if (pageFlipInstance.current) {
            const cur = pageFlipInstance.current.getCurrentPageIndex();
            setCurrentPage(cur);
          }
        });

        const startIdx = Math.max(0, Math.min(numPages - 1, initialPage - 1));
        if (startIdx > 0) {
          pageFlip.flip(startIdx);
          setCurrentPage(startIdx);
        }

        // Instant reveal without blocking: show UI immediately and render current pages in parallel
        setIsLoading(false);
        renderVisiblePages(startIdx, numPages);
      } catch (error) {
        console.error("Flipbook initialization failed:", error);
        setLoadingProgress("Failed to load PDF. Please try refreshing or download directly.");
      }
    }

    // Render pages surrounding the active page asynchronously in parallel
    async function renderVisiblePages(activePageIndex: number, total: number) {
      if (!pdfDocRef.current) return;
      const pagesToRender: number[] = [];
      for (let offset = -1; offset <= 2; offset++) {
        const pageNum = activePageIndex + offset;
        if (pageNum >= 1 && pageNum <= total) {
          pagesToRender.push(pageNum);
        }
      }

      await Promise.all(
        pagesToRender.map(async (pageNum) => {
          if (!renderedPagesRef.current.has(pageNum)) {
            renderedPagesRef.current.add(pageNum);
            const canvas = document.getElementById(`page-canvas-${pageNum}`) as HTMLCanvasElement;
            const loader = document.getElementById(`page-loader-${pageNum}`);
            if (canvas) {
              await renderPageToCanvas(pageNum, canvas, 1.4);
              if (loader) {
                loader.style.opacity = "0";
                setTimeout(() => loader.remove(), 200);
              }
            }
          }
        })
      );
    }

    initReader();

    return () => {
      isCancelled = true;
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [pdfUrl, renderPageToCanvas, initialPage]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        pageFlipInstance.current?.flipNext();
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        pageFlipInstance.current?.flipPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        pageFlipInstance.current?.flip(0);
      } else if (e.key === "End" && totalPages > 0) {
        e.preventDefault();
        pageFlipInstance.current?.flip(totalPages - 1);
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen?.();
        }
        setShowThumbnails(false);
        setShowHelp(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, totalPages]);

  // Fullscreen change listener
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error("Fullscreen error:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        console.error("Exit fullscreen error:", err);
      });
    }
  };

  // Flip Actions
  const handlePrev = () => pageFlipInstance.current?.flipPrev();
  const handleNext = () => pageFlipInstance.current?.flipNext();
  const handleFirst = () => pageFlipInstance.current?.flip(0);
  const handleLast = () => totalPages > 0 && pageFlipInstance.current?.flip(totalPages - 1);
  const handleJumpToPage = (index: number) => {
    pageFlipInstance.current?.flip(index);
    setShowThumbnails(false);
  };

  // Load thumbnail on demand
  const loadThumbnail = async (pageNum: number) => {
    if (renderedThumbnails[pageNum] || !pdfDocRef.current) return;
    try {
      const page = await pdfDocRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.25 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      setRenderedThumbnails(prev => ({ ...prev, [pageNum]: dataUrl }));
    } catch (e) {
      console.error(`Failed thumbnail for page ${pageNum}`, e);
    }
  };

  // Load visible thumbnails when drawer opens
  useEffect(() => {
    if (showThumbnails && pdfDocRef.current && totalPages > 0) {
      for (let i = 1; i <= Math.min(totalPages, 30); i++) {
        loadThumbnail(i);
      }
    }
  }, [showThumbnails, totalPages]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col w-full bg-white text-slate-800 select-none shadow-xl ${isFullscreen ? "h-screen" : "min-h-[92vh] rounded-2xl overflow-hidden border border-slate-200/80 shadow-slate-300/50"
        }`}
    >
      {/* Top Header Bar */}
      <div
        role="region"
        aria-label="Magazine header controls"
        className={`relative z-30 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm transition-all duration-300 ${showNav || showThumbnails || showHelp
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none absolute top-0 inset-x-0"
          }`}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/magazine"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0a0080] border border-slate-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0a0080]" />
            <span>Back</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-slate-300" />
          <div className="hidden sm:flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0a0080]" />
            <div>
              <h1 className="text-sm font-bold tracking-wide text-[#0a0080] leading-none font-poppins">
                {title}
              </h1>
              <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(0.7, +(prev - 0.15).toFixed(2)))}
              disabled={zoomLevel <= 0.7}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-600 hover:text-[#0a0080] hover:bg-slate-200 rounded transition"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(2.0, +(prev + 0.15).toFixed(2)))}
              disabled={zoomLevel >= 2.0}
              className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Thumbnails Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className={`p-2 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${showThumbnails
              ? "bg-[#0a0080] text-white shadow-sm ring-1 ring-blue-500"
              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            title="Toggle Thumbnails Grid"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Pages</span>
          </button>

          {/* Help button */}
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            title="Help & Shortcuts"
          >
            <HelpCircle className="w-4 h-4 text-slate-600" />
          </button>

          {/* Download Original PDF */}
          <a
            href={pdfUrl}
            download="BODHIKA - The SoIT Gazette.pdf"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#0a0080] via-[#1a1a9d] to-[#070060] hover:opacity-90 text-white text-xs font-semibold shadow-sm border border-blue-900 transition"
            title="Download full PDF"
          >
            <Download className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Flipbook Stage */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2 sm:p-6 bg-slate-100/90 border-y border-slate-200/80">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md text-slate-800">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#0a0080] animate-spin" />
              <BookOpen className="w-7 h-7 text-[#0a0080] absolute" />
            </div>
            <p className="mt-5 text-base font-semibold text-slate-900 font-poppins">Loading 3D Magazine Viewer</p>
            <p className="mt-1.5 text-xs text-slate-500">{loadingProgress}</p>
          </div>
        )}

        {/* Flipbook Container (Scales up smoothly to 1.15x when nav is auto-hidden for maximized screen reading) */}
        <div
          className="relative transition-all duration-500 ease-out flex items-center justify-center"
          style={{
            transform: `scale(${zoomLevel * (!showNav && !showThumbnails && !showHelp ? 1.15 : 1)}) translateX(${!isMobileView && pageWidth > 0
              ? currentPage === 0
                ? `-${pageWidth / 2}px`
                : totalPages > 0 && currentPage >= totalPages - 1
                  ? `${pageWidth / 2}px`
                  : "0px"
              : "0px"
              })`,
          }}
        >
          <div
            ref={bookRef}
            className="shadow-[0_25px_80px_-20px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden transition-all duration-500"
            style={{
              clipPath:
                !isMobileView && pageWidth > 0
                  ? currentPage === 0
                    ? `inset(0 0 0 50%)`
                    : totalPages > 0 && currentPage >= totalPages - 1
                      ? `inset(0 50% 0 0)`
                      : "none"
                  : "none",
            }}
          />
        </div>

        {/* Floating Side Flip Navigators */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage === 0}
          className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl shadow-slate-950/40 backdrop-blur-sm border border-slate-200 transition disabled:opacity-20 disabled:pointer-events-none hover:scale-105 active:scale-95"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-6 h-6 text-[#0a0080]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={totalPages > 0 && currentPage >= totalPages - 1}
          className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl shadow-slate-950/40 backdrop-blur-sm border border-slate-200 transition disabled:opacity-20 disabled:pointer-events-none hover:scale-105 active:scale-95"
          aria-label="Next Page"
        >
          <ChevronRight className="w-6 h-6 text-[#0a0080]" />
        </button>

        {/* Thumbnails Side Drawer */}
        {showThumbnails && (
          <div
            role="region"
            aria-label="Pages overview drawer"
            className="absolute inset-y-0 right-0 z-30 w-72 sm:w-80 bg-white/98 backdrop-blur-xl border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-slate-800"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-[#0a0080]" />
                <span className="text-sm font-semibold text-slate-900">Pages Overview</span>
                <span className="text-xs text-slate-500">({totalPages})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowThumbnails(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 custom-scrollbar">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                const isSelected = currentPage === pageNum - 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handleJumpToPage(pageNum - 1)}
                    onMouseEnter={() => loadThumbnail(pageNum)}
                    className={`group relative flex flex-col items-center rounded-lg p-1.5 border transition text-left ${isSelected
                      ? "border-[#0a0080] bg-blue-50/80 ring-2 ring-[#0a0080]/30 shadow-md"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                  >
                    <div className="w-full aspect-3/4 bg-slate-200 rounded flex items-center justify-center overflow-hidden relative shadow-inner">
                      {renderedThumbnails[pageNum] ? (
                        <img
                          src={renderedThumbnails[pageNum]}
                          alt={`Page ${pageNum}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-400">
                          <Loader2 className="w-4 h-4 animate-spin mb-1 text-[#0a0080]" />
                          <span className="text-[10px]">{pageNum}</span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`mt-1.5 text-[11px] font-medium ${isSelected ? "text-[#0a0080] font-bold" : "text-slate-600 group-hover:text-slate-900"
                        }`}
                    >
                      Page {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Shortcuts / Help Modal */}
        {showHelp && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-slate-800 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-base font-poppins">
                  <HelpCircle className="w-5 h-5 text-[#0a0080]" />
                  <span>Reader Controls</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHelp(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>


              <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Next Page</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-800">Right Arrow / Space / Click</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Previous Page</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-800">Left Arrow</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">First / Last Page</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-800">Home / End</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-600">Corner Drag</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-800">Click & Drag corner</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Close Modals</span>
                  <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-slate-800">Esc</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowHelp(false)}
                className="mt-5 w-full py-2 bg-[#0a0080] hover:bg-[#1a1a9d] text-white rounded-xl font-medium text-xs shadow-md transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
