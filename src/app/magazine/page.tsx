"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Download,
} from "lucide-react";
import { useBook3DTilt } from "./useBook3DTilt";
import WaveDivider from "@components/magazine/WaveDivider";
import CascadingPhotoSlider from "@components/magazine/CascadingPhotoSlider";
import {
  polaroidMoments,
} from "@components/magazine/data/magazineData";

export default function MagazinePage() {
  const {
    cardRef,
    rotate,
    isHovered,
    glarePos,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  } = useBook3DTilt(10);

  return (
    <div className="w-full min-h-screen bg-[#FAF9FB] text-gray-800 overflow-x-hidden relative font-sans">
      {/* =========================================================================
          HERO SECTION: BODHIKA 3D MAGAZINE SHOWCASE & REVOLVING CONSTELLATION
          ========================================================================= */}
      <section className="min-h-screen w-full relative flex flex-col items-center justify-between px-4 sm:px-8 pt-5 sm:pt-7 pb-8 sm:pb-9 overflow-hidden [perspective:1400px] bg-[radial-gradient(ellipse_at_50%_32%,_#FFFFFF_0%,_#FAF9FB_40%,_#F5F4F8_85%,_#F0EFF4_100%)]">
        {/* Background Atmosphere */}
        <div className="pointer-events-none absolute inset-0 w-full h-full overflow-hidden">
          <div className="absolute inset-0 w-full h-full opacity-[0.22] mix-blend-multiply pointer-events-none [mask-image:radial-gradient(ellipse_95%_85%_at_50%_50%,_rgba(0,0,0,1)_30%,_rgba(0,0,0,0.6)_65%,_rgba(0,0,0,0)_100%)] [-webkit-mask-image:radial-gradient(ellipse_95%_85%_at_50%_50%,_rgba(0,0,0,1)_30%,_rgba(0,0,0,0.6)_65%,_rgba(0,0,0,0)_100%)]">
            <Image
              src="/images/rgpv-campus-aerial-crimson.jpg"
              alt="RGPV Campus Aerial View"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <svg
            className="absolute w-[180%] h-[130%] -left-[40%] -top-[15%] opacity-60"
            viewBox="0 0 1440 900"
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M-100 420 C 320 280, 580 620, 1100 320 C 1320 180, 1500 120, 1600 90"
              stroke="#6A0E20"
              strokeWidth="95"
              strokeLinecap="round"
              strokeOpacity="0.3"
            />
            <path
              d="M-80 470 C 350 330, 620 660, 1130 360 C 1340 220, 1510 160, 1620 130"
              stroke="#921B35"
              strokeWidth="75"
              strokeLinecap="round"
              strokeOpacity="0.38"
            />
            <path
              d="M-60 520 C 380 380, 650 700, 1160 400 C 1360 260, 1530 200, 1640 170"
              stroke="#CB2D4C"
              strokeWidth="60"
              strokeLinecap="round"
              strokeOpacity="0.45"
            />
            <path
              d="M-40 560 C 400 420, 680 730, 1190 430 C 1380 300, 1540 240, 1660 210"
              stroke="#E54F38"
              strokeWidth="48"
              strokeLinecap="round"
              strokeOpacity="0.52"
            />
            <path
              d="M-20 600 C 420 460, 710 760, 1220 460 C 1400 330, 1560 270, 1680 240"
              stroke="#F48B30"
              strokeWidth="40"
              strokeLinecap="round"
              strokeOpacity="0.58"
            />
            <path
              d="M0 640 C 440 500, 740 790, 1250 490 C 1420 360, 1580 300, 1700 270"
              stroke="#FBB940"
              strokeWidth="32"
              strokeLinecap="round"
              strokeOpacity="0.62"
            />
          </svg>

          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[radial-gradient(ellipse,_rgba(122,18,41,0.18),_rgba(244,168,59,0.12),_transparent)] rounded-full blur-[54px]" />
        </div>

        {/* Bilingual Header */}
        <div className="relative z-20 text-center max-w-3xl mx-auto pt-0 -translate-y-6 shrink-0">
          <h1 className="text-[1.85rem] sm:text-[2.35rem] md:text-[2.85rem] leading-[1.15] font-black tracking-tight text-[#5A0B1D] font-serif [text-shadow:_0_2px_14px_rgba(244,168,59,0.25)]">
            <span className="bg-gradient-to-br from-[#7A1229] via-[#B0182F] via-[#E54F38] to-[#F4A83B] bg-clip-text text-transparent inline-block [filter:drop-shadow(0_2px_8px_rgba(244,168,59,0.2))]">Bodhika</span> <br />
            SoIT Annual Magazine
          </h1>

          <p className="mt-[0.4rem] text-[0.85rem] sm:text-[0.95rem] text-gray-600 font-medium max-w-xl mx-auto leading-relaxed">
            Explore the intellect, research milestones, creative voices, and vibrant journey of School of Information Technology, RGPV Bhopal.
          </p>
        </div>

        {/* Centerpiece 3D Interactive Mockup */}
        <div className="relative z-10 w-full max-w-7xl h-[520px] max-h-[70vh] mx-auto flex items-center justify-center flex-1 [perspective:1400px]">
          {/* Center 3D Book */}
          <div className="relative z-10 w-[408px] h-[490px] max-w-[90vw] max-h-[68vh] mt-1 mx-auto flex flex-col items-center justify-center cursor-pointer -translate-y-2">
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full h-full flex flex-col items-center justify-center [transform-style:preserve-3d] transition-transform duration-300 ease-out"
              style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) ${isHovered ? "translateZ(30px) translateY(2px) scale(1.02)" : "translateZ(0px) scale(1)"
                  }`,
              }}
            >
              <Link
                href="/magazine/read"
                className="group block relative focus:outline-none w-full h-full"
                title="Click to Open BODHIKA 3D Interactive Magazine"
              >
                <div
                  className="absolute -inset-6 rounded-3xl bg-[#7A1229]/25 blur-[36px] transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    transform: `translateZ(-50px) translateY(${isHovered ? "36px" : "24px"}) translateX(${isHovered ? "16px" : "8px"
                      })`,
                    opacity: isHovered ? 0.65 : 0.4,
                  }}
                />

                <div className="relative w-full aspect-[853/1024] [filter:drop-shadow(0_20px_35px_rgba(122,18,41,0.28))] [transform-style:preserve-3d]">
                  <Image
                    src="/magazines/bodhika-3d-upright-book.png"
                    alt="BODHIKA - The SoIT Magazine 3D Book Cover"
                    fill
                    sizes="(max-width: 640px) 380px, (max-width: 768px) 430px, 460px"
                    className="object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                    priority
                  />

                  <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20 rounded-2xl"
                    style={{
                      opacity: glarePos.opacity,
                      background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4), transparent 70%)`,
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Quick CTA Actions */}
        <div className="relative z-20 flex flex-wrap items-center justify-center gap-[0.85rem] mt-3">
          <Link href="/magazine/read" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-br from-[#7A1229]/95 via-[#B0182F]/92 to-[#E54F38]/95 text-white font-bold text-[0.9375rem] backdrop-blur-md shadow-[0_10px_25px_-5px_rgba(122,18,41,0.4),0_0_15px_rgba(244,168,59,0.3),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-[#F4A83B]/40 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_18px_36px_-6px_rgba(122,18,41,0.55),0_0_25px_rgba(244,168,59,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:border-white/80 no-underline">
            <BookOpen className="w-4 h-4" />
            <span>View Magazine</span>
          </Link>

          <a
            href="https://cdn.jsdelivr.net/gh/mohitbirla00000/document@main/magazines/bodhika-the-soit-gazette.pdf"
            download="Bodhika-SoIT-Magazine-2025.pdf"
            className="inline-flex items-center gap-2 px-[1.4rem] py-3 rounded-full bg-white/65 backdrop-blur-md text-[#7A1229] font-bold text-[0.9375rem] shadow-[0_8px_20px_-4px_rgba(122,18,41,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-[#F4A83B]/35 transition-all duration-300 hover:bg-white/90 hover:border-[#7A1229] hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(122,18,41,0.18),0_0_12px_rgba(244,168,59,0.3)] no-underline"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </section>

      {/* Ribbon Divider 1 */}
      <WaveDivider variant="maroon-to-amber" />

      {/* =========================================================================
          SECTION 1: 📸 CAMPUS MOMENTS — "क्षण | Kshan" (POLAROIDS)
          ========================================================================= */}
      <section id="kshan" className="relative py-20 sm:py-24 pb-24 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
          <h2 className="text-[2.15rem] sm:text-[2.65rem] font-black tracking-tight text-[#5A0B1D] font-serif leading-tight [text-shadow:_0_2px_12px_rgba(244,168,59,0.2)]">
            Magazine Gallery
          </h2>
          <p className="mt-3 text-[0.95rem] text-gray-600 leading-relaxed">
            Glimpses of life beyond algorithms — hackathon night-outs, chai debates, fest euphoria, and shared memories that define SOIT.
          </p>
        </div>

        {/* 📸 CASCADING PHOTO SLIDER */}
        <CascadingPhotoSlider moments={polaroidMoments} />
      </section>
    </div>
  );
}

