"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PolaroidMoment } from "./data/magazineData";

interface CascadingPhotoSliderProps {
  moments: PolaroidMoment[];
  activeFilter?: string;
}

export default function CascadingPhotoSlider({
  moments,
  activeFilter = "All",
}: CascadingPhotoSliderProps) {
  const filteredMoments =
    activeFilter === "All"
      ? moments
      : moments.filter((m) => m.moodTag === activeFilter);

  const displayList = filteredMoments.length > 0 ? filteredMoments : moments;
  const count = displayList.length;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(1200);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<number>(0);

  // Dragging refs
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentDragRef = useRef<number>(0);

  // Window resize listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset index on filter change
  useEffect(() => {
    setActiveIndex(0);
    setDragOffset(0);
  }, [activeFilter]);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(((index % count) + count) % count);
      setDragOffset(0);
    },
    [count]
  );

  const nextSlide = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  // Autoplay
  useEffect(() => {
    if (isHovered || count <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Drag & Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.touches[0]) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    currentDragRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !e.touches[0]) return;
    const delta = e.touches[0].clientX - startXRef.current;
    currentDragRef.current = delta;
    setDragOffset(delta);
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const threshold = 45;
    if (currentDragRef.current > threshold) {
      prevSlide();
    } else if (currentDragRef.current < -threshold) {
      nextSlide();
    }
    setDragOffset(0);
  };

  // Card geometry calculator
  const getCardGeometry = (delta: number) => {
    const isMobile = windowWidth < 640;
    const isTablet = windowWidth >= 640 && windowWidth < 1024;

    const absDelta = Math.abs(delta);

    // Responsive dimensions
    if (absDelta === 0) {
      // Center / Active Card
      const width = isMobile ? 220 : isTablet ? 340 : 470;
      const height = isMobile ? 320 : isTablet ? 380 : 440;
      return {
        x: dragOffset * 0.8,
        width,
        height,
        opacity: 1,
        zIndex: 30,
        isActive: true,
      };
    } else if (absDelta === 1) {
      // Immediate Neighbor
      const width = isMobile ? 44 : isTablet ? 95 : 145;
      const height = isMobile ? 260 : isTablet ? 320 : 375;
      const baseX = isMobile ? 135 : isTablet ? 230 : 325;
      const x = Math.sign(delta) * baseX + dragOffset * 0.5;
      return {
        x,
        width,
        height,
        opacity: 0.92,
        zIndex: 20,
        isActive: false,
      };
    } else if (absDelta === 2) {
      // Second Neighbor
      const width = isMobile ? 26 : isTablet ? 65 : 95;
      const height = isMobile ? 215 : isTablet ? 270 : 320;
      const baseX = isMobile ? 175 : isTablet ? 315 : 455;
      const x = Math.sign(delta) * baseX + dragOffset * 0.3;
      return {
        x,
        width,
        height,
        opacity: 0.75,
        zIndex: 12,
        isActive: false,
      };
    } else if (absDelta === 3) {
      // Outer Edge Preview
      const width = isMobile ? 16 : isTablet ? 45 : 65;
      const height = isMobile ? 175 : isTablet ? 220 : 265;
      const baseX = isMobile ? 200 : isTablet ? 375 : 545;
      const x = Math.sign(delta) * baseX + dragOffset * 0.2;
      return {
        x,
        width,
        height,
        opacity: 0.55,
        zIndex: 6,
        isActive: false,
      };
    }

    return {
      x: Math.sign(delta) * 700,
      width: 0,
      height: 0,
      opacity: 0,
      zIndex: 0,
      isActive: false,
    };
  };

  const router = useRouter();

  return (
    <div
      className="relative w-full max-w-full my-6 mb-10 py-6 flex flex-col items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Horizontal Stage Track */}
      <div
        className="relative w-full h-[330px] sm:h-[390px] md:h-[480px] flex items-center justify-center touch-pan-y cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {displayList.map((moment, i) => {
          let delta = i - activeIndex;
          if (delta > count / 2) delta -= count;
          if (delta < -count / 2) delta += count;

          if (Math.abs(delta) > 3) return null;

          const geo = getCardGeometry(delta);

          return (
            <div
              key={moment.id}
              className={`group absolute top-1/2 left-1/2 rounded-[14px] sm:rounded-[16px] md:rounded-[20px] overflow-hidden shadow-[0_18px_40px_-8px_rgba(0,0,0,0.45),0_4px_12px_rgba(0,0,0,0.25)] bg-[#0C0B0E] border border-white/15 [will-change:transform,width,height,opacity] [transform-origin:center_center] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                geo.isActive
                  ? "border-[1.5px] border-white/50 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.65),0_10px_28px_rgba(0,0,0,0.4),0_0_35px_rgba(244,168,59,0.25)]"
                  : ""
              }`}
              style={{
                transform: `translate3d(calc(-50% + ${geo.x}px), -50%, 0)`,
                width: `${geo.width}px`,
                height: `${geo.height}px`,
                opacity: geo.opacity,
                zIndex: geo.zIndex,
                cursor: "pointer",
              }}
              onClick={() => {
                if (geo.isActive) {
                  const targetPage = moment.pageNumber || 28;
                  router.push(`/magazine/read?page=${targetPage}`);
                } else {
                  goToSlide(i);
                }
              }}
              title={geo.isActive ? `Click to open Page ${moment.pageNumber || 28} in 3D Magazine` : undefined}
            >
              <Image
                src={moment.image}
                alt={moment.title || `Campus Photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 220px, (max-width: 1024px) 340px, 470px"
                className="object-cover pointer-events-none w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                priority={geo.isActive}
              />
              <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 pointer-events-none z-10 ${geo.isActive ? "opacity-0" : "group-hover:opacity-5"}`} />

              {/* Hover Reveal Content Overlay */}
              <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[#0a080e]/5 via-[#0a080e]/50 to-[#0a080e]/95 backdrop-blur-md flex flex-col justify-end p-3 sm:p-5 text-white opacity-0 translate-y-2 transition-all duration-300 ease-out z-20 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0">
                <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/35 text-[0.65rem] font-extrabold uppercase tracking-wider text-white mb-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4A83B] shadow-[0_0_8px_#F4A83B]" />
                  <span>{moment.moodTag}</span>
                </div>
                <span className="text-xs font-bold text-[#F4A83B] block mb-0.5 leading-tight">{moment.hindiTitle}</span>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight mb-1 font-serif [text-shadow:_0_2px_6px_rgba(0,0,0,0.6)] whitespace-normal">{moment.title}</h3>
                <p className="font-serif italic text-xs text-white/90 leading-snug mb-2 line-clamp-1 sm:line-clamp-2">“{moment.caption}”</p>
                <div className="flex items-center justify-between pt-1.5 border-t border-white/18">
                  <span className="text-[0.65rem] font-extrabold text-white/80 uppercase tracking-wider">{moment.date}</span>
                  {geo.isActive && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 underline underline-offset-2">
                      Open Page {moment.pageNumber || 28} →
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls Below Slider */}
      <div className="flex items-center justify-center gap-5 mt-7 z-20">
        <button
          type="button"
          onClick={prevSlide}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-white/92 to-[#fef3e6]/88 border-[1.5px] border-white/85 text-[#7A1229] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_6px_18px_rgba(0,0,0,0.18),0_2px_8px_rgba(244,168,59,0.2)] backdrop-blur-md hover:bg-white hover:text-[#CB2D4C] hover:border-[#F4A83B] hover:scale-110 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25),0_0_16px_rgba(244,168,59,0.45)] active:scale-95"
          aria-label="Previous Photo"
          title="Previous Photo"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Slide Indicators / Dots */}
        <div className="flex items-center gap-2">
          {displayList.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-300 ${
                idx === activeIndex
                  ? "w-6 bg-[#F4A83B] shadow-[0_0_10px_rgba(244,168,59,0.5)]"
                  : "w-2 bg-white/25 hover:bg-white/60"
              }`}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          className="w-11 h-11 rounded-full bg-gradient-to-br from-white/92 to-[#fef3e6]/88 border-[1.5px] border-white/85 text-[#7A1229] flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_6px_18px_rgba(0,0,0,0.18),0_2px_8px_rgba(244,168,59,0.2)] backdrop-blur-md hover:bg-white hover:text-[#CB2D4C] hover:border-[#F4A83B] hover:scale-110 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25),0_0_16px_rgba(244,168,59,0.45)] active:scale-95"
          aria-label="Next Photo"
          title="Next Photo"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

