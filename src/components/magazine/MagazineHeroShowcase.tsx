"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Sparkles, ArrowRight, Download } from "lucide-react";

interface FeatureTile {
  id: string;
  title: string;
  emoji: string;
  bgColor: string;
  accentColor: string;
  description: string;
  linkText: string;
  href: string;
  isDownload?: boolean;
}

export default function MagazineHeroShowcase() {
  const [activeId, setActiveId] = useState<string>("read");

  const tiles: Record<string, FeatureTile> = {
    read: {
      id: "read",
      title: "Interactive Reader",
      emoji: "📖",
      bgColor: "bg-red-50",
      accentColor: "#ef4f5f",
      description: "Read BODHIKA in realistic 3D interactive flipbook format.",
      linkText: "Open 3D Reader",
      href: "/magazine/read",
    },
    tech: {
      id: "tech",
      title: "Healthy",
      emoji: "🥗",
      bgColor: "bg-emerald-50",
      accentColor: "#10b981",
      description: "Student Tech & Research Papers",
      linkText: "Read Papers",
      href: "/magazine/read",
    },
    mode: {
      id: "mode",
      title: "Veg Mode",
      emoji: "🟢",
      bgColor: "bg-emerald-50",
      accentColor: "#10b981",
      description: "3D Page-Flip Mode",
      linkText: "Explore",
      href: "/magazine/read",
    },
    party: {
      id: "party",
      title: "Plan a Party",
      emoji: "🎉",
      bgColor: "bg-orange-50",
      accentColor: "#f97316",
      description: "Campus Fests & Cultural Highlights",
      linkText: "View Fests",
      href: "/gallery",
    },
    gifts: {
      id: "gifts",
      title: "Gift Cards",
      emoji: "🎁",
      bgColor: "bg-rose-50",
      accentColor: "#f43f5e",
      description: "Creative Literature & Poetry Anthology",
      linkText: "Read Poems",
      href: "/magazine/read",
    },
    gourmet: {
      id: "gourmet",
      title: "Gourmet",
      emoji: "🍲",
      bgColor: "bg-amber-50",
      accentColor: "#f59e0b",
      description: "Faculty Research & Patents",
      linkText: "View Honors",
      href: "/student-achievements",
    },
    offers: {
      id: "offers",
      title: "Offers",
      emoji: "🏷️",
      bgColor: "bg-blue-50",
      accentColor: "#3b82f6",
      description: "Download Full Original PDF (140 MB)",
      linkText: "Download PDF",
      href: "/magazines/bodhika-the-soit-gazette.pdf",
      isDownload: true,
    },
    train: {
      id: "train",
      title: "Food on Train",
      emoji: "🚆",
      bgColor: "bg-indigo-50",
      accentColor: "#6366f1",
      description: "Alumni Network & Career Roadmaps",
      linkText: "Alumni Trajectory",
      href: "/alumni-network",
    },
    collections: {
      id: "collections",
      title: "Collections",
      emoji: "🍔",
      bgColor: "bg-amber-50",
      accentColor: "#d97706",
      description: "Past Volumes & Publication Archives",
      linkText: "View Archive",
      href: "/magazine/read",
    },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#fdf2f4] via-[#fdf6f7] to-[#ffffff] flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
      {/* Soft Ambient Radial Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-rose-200/35 blur-3xl" />
      </div>

      <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Top Header matching reference */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h1 className="font-poppins text-3xl font-bold tracking-tight text-[#ef4f5f] sm:text-4xl lg:text-[44px] leading-tight">
            What’s waiting for you <br /> on the app?
          </h1>
          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg mx-auto">
            Our app is packed with features that enable you to experience food
            delivery like never before
          </p>
        </div>

        {/* Central Visual Stage */}
        <div className="relative w-full max-w-4xl flex items-center justify-center min-h-[480px] sm:min-h-[540px]">
          
          {/* ================= LEFT FLOATING CARDS ================= */}
          {/* Card 1: Healthy (Far Left, Upper) */}
          <div className="absolute left-1 sm:left-4 lg:left-8 top-4 sm:top-8 z-20">
            <button
              type="button"
              onClick={() => setActiveId("tech")}
              onMouseEnter={() => setActiveId("tech")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">
                🥗
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800">
                Healthy
              </span>
            </button>
          </div>

          {/* Card 2: Veg Mode (Inner Left, Top) */}
          <div className="absolute left-[104px] sm:left-[160px] lg:left-[190px] top-0 sm:top-2 z-20">
            <button
              type="button"
              onClick={() => setActiveId("mode")}
              onMouseEnter={() => setActiveId("mode")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-12 h-6.5 rounded-full bg-emerald-500 p-0.5 flex items-center justify-end shadow-xs">
                <div className="w-5.5 h-5.5 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] text-emerald-600 font-bold">
                  ✓
                </div>
              </div>
              <span className="mt-3 text-xs font-semibold text-slate-800">
                Veg Mode
              </span>
            </button>
          </div>

          {/* Card 3: Plan a Party (Far Left, Lower) */}
          <div className="absolute left-1 sm:left-6 lg:left-12 bottom-6 sm:bottom-10 z-20">
            <button
              type="button"
              onClick={() => setActiveId("party")}
              onMouseEnter={() => setActiveId("party")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">
                🎉
              </div>
              <span className="mt-1 text-xs font-semibold text-slate-800 text-center leading-tight">
                Plan <br /> a Party
              </span>
            </button>
          </div>

          {/* Card 4: Gift Cards (Inner Left, Bottom) */}
          <div className="absolute left-[108px] sm:left-[170px] lg:left-[205px] bottom-2 sm:bottom-4 z-20">
            <button
              type="button"
              onClick={() => setActiveId("gifts")}
              onMouseEnter={() => setActiveId("gifts")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl">
                💌
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800">
                Gift Cards
              </span>
            </button>
          </div>

          {/* ================= CENTER: FRONT PAGE OF MAGAZINE IN PLACE OF MOBILE ================= */}
          <div className="relative z-10 w-[240px] sm:w-[280px] md:w-[320px]">
            <Link
              href="/magazine/read"
              className="group block relative focus:outline-none"
              title="Open BODHIKA 3D Flipbook Reader"
            >
              {/* Magazine Cover Card - Sized exactly in place of mobile */}
              <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px] border-[5px] sm:border-[6px] border-white bg-slate-900 shadow-[0_25px_65px_-12px_rgba(227,6,19,0.3),0_15px_35px_-10px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_35px_80px_-15px_rgba(227,6,19,0.4)]">
                
                {/* Real Magazine Cover Image */}
                <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-slate-950">
                  <Image
                    src="/magazines/bodhika-cover.jpg"
                    alt="BODHIKA Front Cover - SoIT Annual Magazine"
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    priority
                  />

                  {/* Subtle Spine Light Gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10" />

                  {/* Inner Floating Center Card (matching the "Schedule your order" center card) */}
                  <div className="absolute inset-x-4 bottom-5 flex flex-col items-center">
                    <div className="w-full max-w-[200px] bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/60 flex flex-col items-center text-center transition-all duration-300 group-hover:bg-white group-hover:scale-105">
                      {/* Top Icon Pill */}
                      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-lg mb-1 shadow-xs">
                        📖
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        Read Online
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                        <Sparkles className="size-2.5 text-[#ef4f5f]" />
                        3D Interactive
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Ambient Glow underneath */}
              <div className="pointer-events-none absolute -bottom-4 inset-x-8 h-8 rounded-full bg-red-600/20 blur-xl transition-all group-hover:bg-red-600/35" />
            </Link>
          </div>

          {/* ================= RIGHT FLOATING CARDS ================= */}
          {/* Card 5: Gourmet (Inner Right, Top) */}
          <div className="absolute right-[104px] sm:right-[160px] lg:right-[190px] top-0 sm:top-2 z-20">
            <button
              type="button"
              onClick={() => setActiveId("gourmet")}
              onMouseEnter={() => setActiveId("gourmet")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">
                🍲
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800">
                Gourmet
              </span>
            </button>
          </div>

          {/* Card 6: Offers (Far Right, Upper) */}
          <div className="absolute right-1 sm:right-4 lg:right-8 top-4 sm:top-8 z-20">
            <button
              type="button"
              onClick={() => setActiveId("offers")}
              onMouseEnter={() => setActiveId("offers")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-9 h-11 bg-blue-500 rounded-md rotate-12 flex flex-col items-center justify-center text-white text-[11px] font-bold shadow-xs">
                <span className="text-[10px]">%</span>
                <span className="text-[7px] uppercase font-mono">PDF</span>
              </div>
              <span className="mt-1.5 text-xs font-semibold text-slate-800">
                Offers
              </span>
            </button>
          </div>

          {/* Card 7: Food on Train (Inner Right, Bottom) */}
          <div className="absolute right-[108px] sm:right-[170px] lg:right-[205px] bottom-2 sm:bottom-4 z-20">
            <button
              type="button"
              onClick={() => setActiveId("train")}
              onMouseEnter={() => setActiveId("train")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                🚆
              </div>
              <span className="mt-1 text-xs font-semibold text-slate-800 text-center leading-tight">
                Food on <br /> Train
              </span>
            </button>
          </div>

          {/* Card 8: Collections (Far Right, Lower) */}
          <div className="absolute right-1 sm:right-6 lg:right-12 bottom-6 sm:bottom-10 z-20">
            <button
              type="button"
              onClick={() => setActiveId("collections")}
              onMouseEnter={() => setActiveId("collections")}
              className="flex flex-col items-center justify-center w-[92px] h-[96px] sm:w-[112px] sm:h-[114px] bg-white rounded-2xl sm:rounded-3xl shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:shadow-[0_18px_35px_-5px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1.5 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">
                🍔
              </div>
              <span className="mt-2 text-xs font-semibold text-slate-800">
                Collections
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
