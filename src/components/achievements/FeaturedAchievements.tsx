"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Award, Sparkles, } from "lucide-react";
import { cn } from "@/utils/utils";
import { Achievement, achievements } from "@/data/student_achievements/achievements";

const ANIM_MS = 520;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * With `noUncheckedIndexedAccess`, arr[i] is always possibly undefined.
 * This helper makes indexing type-safe and removes "possibly undefined" errors.
 */
function mustGet<T>(arr: readonly T[], i: number, label = "item"): T {
  const v = arr[i];
  if (v === undefined) {
    throw new Error(`Expected ${label} at index ${i}, but it was undefined.`);
  }
  return v;
}

export default function FeaturedAchievements() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  const len = achievements.length;

  const [index, setIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isTextFading, setIsTextFading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const textTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (textTimerRef.current) window.clearTimeout(textTimerRef.current);
    };
  }, []);

  if (len === 0) return null;

  const safeIndex = mod(index, len);
  const safePendingIndex =
    pendingIndex === null ? null : mod(pendingIndex, len);

  const current = mustGet(achievements, safeIndex, "achievement");
  const incoming =
    safePendingIndex === null
      ? null
      : mustGet(achievements, safePendingIndex, "achievement");


  function goTo(nextIndexRaw: number, dirOverride?: "next" | "prev") {
    const nextIndex = mod(nextIndexRaw, len);
    if (nextIndex === safeIndex) return;

    if (prefersReducedMotion) {
      setIndex(nextIndex);
      setTextIndex(nextIndex);
      setPendingIndex(null);
      setIsAnimating(false);
      setIsTextFading(false);
      return;
    }

    if (isAnimating) return;

    const chosenDir = dirOverride ?? (
      nextIndexRaw > safeIndex
        ? "next"
        : nextIndexRaw < safeIndex
          ? "prev"
          : nextIndex > safeIndex
            ? "next"
            : "prev"
    )
    setDirection(chosenDir);
    setPendingIndex(nextIndex);
    setIsAnimating(true);
    setIsTextFading(true);

    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (textTimerRef.current) window.clearTimeout(textTimerRef.current);

    textTimerRef.current = window.setTimeout(() => {
      setTextIndex(nextIndex);
      setIsTextFading(false);
    }, 220);

    timerRef.current = window.setTimeout(() => {
      setIndex(nextIndex);
      setPendingIndex(null);
      setIsAnimating(false);
    }, ANIM_MS);
  }

  function next() {
    goTo(safeIndex + 1, "next");
  }

  function prev() {
    goTo(safeIndex - 1, "prev");
  }

  return (
    <section
      className="
      relative overflow-hidden bg-slate-50 py-10
      sm:py-14 lg:py-16
    "
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
          absolute -top-24 left-8 size-72 rounded-full bg-white/70 blur-3xl
        "
        />
        <div
          className="
          absolute right-8 -bottom-28 size-80 rounded-full bg-white/60 blur-3xl
        "
        />
      </div>

      <div
        className="
        relative mx-auto max-w-7xl px-4
        sm:px-6
        lg:px-8
      "
      >
        <header className="mx-auto mb-6 max-w-2xl text-center sm:mb-8 lg:mb-10">
          <h2
            className="
            text-2xl font-semibold tracking-tight text-slate-900
            sm:text-3xl lg:text-4xl
          "
          >
            Featured Achievements
          </h2>
          <p
            className="
            mt-2 text-sm text-slate-600 
            sm:mt-3 sm:text-base lg:text-lg
          "
          >
            A curated spotlight on standout accomplishments across innovation,
            research, and competitions.
          </p>
        </header>

        <div
          className="
          relative overflow-hidden rounded-2xl border border-slate-200/70
          bg-white/55 shadow-[0_22px_70px_-45px_rgba(15,23,42,0.55)]
          backdrop-blur-xl
          supports-backdrop-filter:bg-white/45
          sm:rounded-3xl
        "
        >
          <div
            className="
            pointer-events-none absolute inset-0 opacity-60
            motion-reduce:hidden
          "
          >
            <div
              className="
              absolute top-0 -left-1/2 h-full w-1/2 rotate-12
              animate-[sheen_7s_ease-in-out_infinite] bg-white/25 blur-2xl
            "
            />
          </div>

          <div
            className="
            grid grid-cols-1 gap-6 p-4
            sm:gap-8 sm:p-6 md:grid-cols-2 md:gap-8 md:p-8
            lg:grid-cols-12 lg:gap-8 lg:p-10
            xl:gap-10
          "
          >
            {/* Left rail */}
            <aside
              className="
              order-2
              md:order-3 md:col-span-2
              lg:order-1 lg:col-span-3
            "
            >
              <div
                className="
                flex items-center justify-between
                md:flex-row md:items-center lg:flex-col lg:items-start lg:gap-4
              "
              >
                <span
                  className="
                  text-xs font-semibold tracking-wider text-slate-600
                "
                >
                  <span className="font-mono">
                    {String(safeIndex + 1).padStart(2, "0")}
                  </span>{" "}
                  <span className="text-slate-400">/</span>{" "}
                  <span className="font-mono">
                    {String(len).padStart(2, "0")}
                  </span>
                </span>

                <div
                  className="
                  flex items-center gap-2 text-xs font-semibold
                  tracking-[0.22em] text-slate-500 uppercase
                "
                >
                  <Sparkles className="size-4" />
                  Spotlight
                </div>
              </div>

              <div
                className="
                mt-4 flex gap-2.5 overflow-x-auto pb-2 pt-1
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
                md:mt-6 md:grid md:grid-cols-3 md:gap-3.5 md:overflow-visible md:pb-0 lg:mt-8 lg:flex lg:flex-col lg:gap-2
              "
              >
                {achievements.map((a, i) => {
                  const active = i === safeIndex;
                  return (
                    <button
                      key={a.title}
                      onClick={() => goTo(i)}
                      disabled={isAnimating}
                      className={cn(
                        `
                          group relative w-[15rem] shrink-0 rounded-2xl
                          text-left sm:w-[16rem]
                          md:w-full md:shrink
                        `,
                        "border bg-white/55 backdrop-blur-sm",
                        `
                          transition duration-300
                          motion-reduce:transition-none
                        `,
                        active
                          ? `
                            border-slate-300/80
                            shadow-[0_10px_30px_-24px_rgba(15,23,42,0.35)]
                          `
                          : `
                            border-slate-200/70
                            hover:border-slate-300/80
                          `,
                        isAnimating && "opacity-80",
                      )}
                      aria-label={`Show achievement: ${a.title}`}
                    >
                      <div className="p-2.5 sm:p-3">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <span
                            className="
                            inline-flex size-9 sm:size-10 shrink-0 items-center justify-center
                            rounded-xl bg-slate-900 text-white shadow-sm ring-1
                            ring-slate-900/10
                          "
                          >
                            {a.icon}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span
                                className={cn(
                                  `
                                    inline-flex items-center rounded-full px-2 sm:px-2.5
                                    py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold
                                  `,
                                  a.accent.chipBg,
                                  a.accent.chipText,
                                  "ring-1 ring-slate-900/5",
                                )}
                              >
                                {a.category}
                              </span>
                              <span
                                className="
                                text-[10px] sm:text-[11px] font-medium text-slate-500
                              "
                              >
                                {a.year}
                              </span>
                            </div>
                            <p
                              className="
                              mt-1 line-clamp-2 text-xs sm:text-sm font-semibold
                              text-slate-900
                            "
                            >
                              {a.title}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={cn(
                          "absolute inset-y-0 left-0 w-1 rounded-l-2xl",
                          active ? "bg-slate-900" : "bg-transparent",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Center preview */}
            <div
              className="
              order-1
              md:order-1 md:col-span-1
              lg:order-2 lg:col-span-4
            "
            >
              <div
                className="
                relative h-[25rem] overflow-hidden rounded-2xl border
                border-slate-200/70 bg-white/55 backdrop-blur-sm
                sm:h-[26rem]
                md:h-[28rem]
                lg:h-[32rem]
              "
              >
                <div
                  className="
                  pointer-events-none absolute inset-0
                  bg-[linear-gradient(to_bottom,rgba(15,23,42,1)_1px,transparent_1px)]
                  bg-size-[8px_8px] opacity-[0.035]
                "
                />
                <div
                  className={cn(
                    `
                      pointer-events-none absolute -top-10 left-1/2 size-44
                      -translate-x-1/2 rounded-full blur-3xl
                    `,
                    current.accent.glow,
                  )}
                />

                <div className="absolute inset-0 p-3 sm:p-5">
                  <div
                    className={cn(
                      `
                        absolute inset-3 overflow-hidden rounded-xl border
                        border-slate-200/70 bg-white sm:inset-5
                      `,
                      "shadow-[0_18px_50px_-35px_rgba(15,23,42,0.55)]",
                      !incoming && "translate-y-0 opacity-100",
                      incoming &&
                      (direction === "next"
                        ? "animate-[panelOutUp_520ms_ease-in-out_forwards]"
                        : "animate-[panelOutDown_520ms_ease-in-out_forwards]"),
                    )}
                  >
                    <PosterCard a={current} />
                  </div>

                  {incoming && (
                    <div
                      className={cn(
                        `
                          absolute inset-3 overflow-hidden rounded-xl border
                          border-slate-200/70 bg-white sm:inset-5
                        `,
                        "shadow-[0_18px_50px_-35px_rgba(15,23,42,0.55)]",
                        direction === "next"
                          ? "animate-[panelInUp_520ms_ease-in-out_forwards]"
                          : "animate-[panelInDown_520ms_ease-in-out_forwards]",
                      )}
                    >
                      <PosterCard a={incoming} />
                    </div>
                  )}
                </div>
              </div>

              <div
                className="
                mt-4 flex items-center justify-between gap-3
                md:mt-5
              "
              >
                <button
                  type="button"
                  onClick={prev}
                  disabled={isAnimating}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full",
                    `
                      border border-slate-200/80 bg-white/60 p-2.5 text-slate-900
                      backdrop-blur-sm sm:p-3
                    `,
                    `
                      transition
                      hover:border-slate-300/80 hover:bg-white/80
                    `,
                    `
                      focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                      focus:outline-none
                    `,
                    isAnimating && "opacity-70",
                  )}
                  aria-label="Previous achievement"
                >
                  <ArrowLeft className="size-4.5 sm:size-5" />
                </button>

                <div
                  className="flex items-center gap-1.5"
                  aria-label="Slider position"
                >
                  {achievements.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      disabled={isAnimating}
                      className={cn(
                        "h-1.5 rounded-full transition-all",
                        i === safeIndex
                          ? "w-7 bg-slate-900"
                          : `
                          w-2 bg-slate-300/70
                          hover:bg-slate-400/70
                        `,
                      )}
                      aria-label={`Go to achievement ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={next}
                  disabled={isAnimating}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full",
                    `
                      border border-slate-200/80 bg-white/60 p-2.5 text-slate-900
                      backdrop-blur-sm sm:p-3
                    `,
                    `
                      transition
                      hover:border-slate-300/80 hover:bg-white/80
                    `,
                    `
                      focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                      focus:outline-none
                    `,
                    isAnimating && "opacity-70",
                  )}
                  aria-label="Next achievement"
                >
                  <ArrowRight className="size-4.5 sm:size-5" />
                </button>
              </div>
            </div>

            {/* Right text */}
            <div
              className="
              order-3
              md:order-2 md:col-span-1 md:pl-0
              lg:order-3 lg:col-span-5 lg:pl-2
            "
            >
              <div
                className="
                relative flex min-h-56 flex-col overflow-hidden rounded-2xl border
                border-slate-200/70 bg-white/55 p-5 backdrop-blur-sm
                sm:p-6 md:min-h-[28rem] md:p-7
                lg:min-h-[32rem]
              "
              >
                <div
                  className={cn(
                    "flex h-full flex-col transition-all duration-200 ease-out",
                    isTextFading

                      ? direction === "next"
                        ? "-translate-x-6 opacity-0"
                        : "translate-x-6 opacity-0"
                      : "translate-x-0 opacity-100",
                  )}
                >
                  <AchievementText a={
                    mustGet(achievements, textIndex, "achievement")
                  } />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterCard({ a }: { a: Achievement }) {
  return (
    <div className="relative flex h-full flex-col">
      <div
        className="
        flex shrink-0 items-center justify-between border-b border-slate-200/70
        bg-slate-50 px-4 py-3 sm:px-5 sm:py-3.5
      "
      >
        <span
          className={cn(
            `
              inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]
              font-semibold sm:gap-2 sm:px-3 sm:py-1 sm:text-xs
            `,
            a.accent.chipBg,
            a.accent.chipText,
            "ring-1 ring-slate-900/5",
          )}
        >
          <Award className="size-3.5 sm:size-4" />
          {a.category}
        </span>
        <span className="text-[11px] font-medium text-slate-500 sm:text-xs">{a.year}</span>
      </div>

      <div
        className="
        relative flex flex-1 flex-col items-center justify-center px-4 py-4 text-center
        sm:px-6 sm:py-5
      "
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
            absolute top-3 left-3 size-6 border-t border-l border-slate-200/90
            sm:top-5 sm:left-5 sm:size-8
            md:top-6 md:left-6 md:size-9
          "
          />
          <div
            className="
            absolute top-3 right-3 size-6 border-t border-r border-slate-200/90
            sm:top-5 sm:right-5 sm:size-8
            md:top-6 md:right-6 md:size-9
          "
          />
          <div
            className="
            absolute bottom-3 left-3 size-6 border-b border-l border-slate-200/90
            sm:bottom-5 sm:left-5 sm:size-8
            md:bottom-6 md:left-6 md:size-9
          "
          />
          <div
            className="
            absolute right-3 bottom-3 size-6 border-r border-b border-slate-200/90
            sm:right-5 sm:bottom-5 sm:size-8
            md:right-6 md:bottom-6 md:size-9
          "
          />
        </div>

        <div
          className={cn(
            `
              mb-3 inline-flex size-12 items-center justify-center rounded-xl
              bg-slate-900 text-white shadow-sm ring-2
              sm:mb-4 sm:size-14 sm:rounded-2xl
              md:mb-5 md:size-16
            `,
            a.accent.ring,
          )}
        >
          <span className="[&>svg]:size-5 sm:[&>svg]:size-6">
            {a.icon}
          </span>
        </div>

        <h3
          className="
          line-clamp-2 text-base/snug font-semibold text-slate-900
          sm:text-lg/snug md:text-xl/snug
        "
        >
          {a.title}
        </h3>

        <p className="mt-1 text-xs font-medium text-slate-600 sm:mt-1.5 sm:text-sm">
          {a.student}
        </p>

        <div className="mt-3 h-px w-16 bg-slate-200 sm:mt-4 sm:w-20 md:mt-5 md:w-24" />

        <p
          className="
          mt-2.5 max-w-xs line-clamp-3 text-xs/relaxed text-slate-600
          sm:mt-3 sm:max-w-sm sm:text-sm/relaxed
          md:mt-4
        "
        >
          {a.description}
        </p>
      </div>
    </div>
  );
}

function AchievementText({ a }: { a: Achievement }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            `
              inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px]
              font-semibold sm:px-3 sm:py-1 sm:text-xs
            `,
            a.accent.chipBg,
            a.accent.chipText,
            "ring-1 ring-slate-900/5",
          )}
        >
          {a.category}
        </span>
        <span className="text-[11px] font-medium text-slate-500 sm:text-xs">{a.year}</span>
      </div>

      <h3
        className="
        mt-3 text-xl font-semibold tracking-tight text-slate-900
        sm:mt-4 sm:text-2xl
        md:text-3xl
      "
      >
        {a.title}
      </h3>

      <p className="mt-1.5 text-xs font-semibold text-slate-700 sm:mt-2 sm:text-sm">
        {a.student}
      </p>

      <p className="mt-3 text-sm/relaxed text-slate-600 sm:mt-4 sm:text-base/relaxed md:mt-5">
        {a.description}
      </p>

      <div className="mt-auto pt-4 sm:pt-6">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className="
            inline-flex size-6 items-center justify-center rounded-full border
            border-slate-200/70 bg-white sm:size-7
          "
          >
            <Sparkles className="size-3.5 text-slate-700 sm:size-4" />
          </span>
          <span className="text-[11px] sm:text-xs">
            Curated highlight from the academic year
          </span>
        </div>
      </div>
    </div>
  );
}

