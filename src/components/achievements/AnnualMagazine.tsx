import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Download,
  FileText,
  FlaskConical,
  Image as ImageIcon,
  PenLine,
  ShieldCheck,
} from "lucide-react";

export default function AnnualMagazine() {
  return (
    <section
      className="
      bg-slate-50 py-14
      sm:py-16
    "
    >
      <div
        className="
        mx-auto max-w-7xl
        sm:px-6
        lg:px-8
      "
      >
        <div
          className={[
            "relative overflow-hidden rounded-3xl",
            "border border-slate-200/70",
            "bg-white/55 backdrop-blur-xl supports-backdrop-filter:bg-white/45",
            "shadow-[0_18px_60px_-35px_rgba(15,23,42,0.45)]",
          ].join(" ")}
        >
          <div className="pointer-events-none absolute inset-0">
            <div
              className="
              absolute -top-24 left-10 size-56 rounded-full bg-white/40 blur-3xl
            "
            />
            <div
              className="
              absolute right-10 -bottom-24 size-56 rounded-full bg-white/35
              blur-3xl
            "
            />
          </div>

          <div
            className="
            relative grid grid-cols-1 items-center gap-10 p-6
            sm:p-10
            md:grid-cols-2
          "
          >
            <div>
              <div
                className="
                inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-3
                py-1.5 text-xs font-semibold text-slate-700 ring-1
                ring-slate-900/10
              "
              >
                <ShieldCheck className="size-4" />
                Annual Publication
              </div>

              <h2
                className="
                mt-4 text-3xl font-semibold tracking-tight text-slate-900
                sm:text-4xl
              "
              >
                SoIT Annual Magazine
              </h2>

              <p
                className="
                mt-3 max-w-xl text-base/relaxed text-slate-600
                sm:text-lg
              "
              >
                Explore our annual magazine featuring student achievements,
                faculty research, campus events, and key stories from the
                academic year.
              </p>

              <ul
                className="
                mt-6 grid gap-3
                sm:grid-cols-2
              "
              >
                <li
                  className="
                  flex items-start gap-3 rounded-xl border border-slate-200/70
                  bg-white/50 p-3
                "
                >
                  <span
                    className="
                    mt-0.5 inline-flex size-9 items-center justify-center
                    rounded-lg bg-slate-900 text-white
                  "
                  >
                    <BookOpen className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Student writing
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      Articles, editorials, and creative work
                    </p>
                  </div>
                </li>

                <li
                  className="
                  flex items-start gap-3 rounded-xl border border-slate-200/70
                  bg-white/50 p-3
                "
                >
                  <span
                    className="
                    mt-0.5 inline-flex size-9 items-center justify-center
                    rounded-lg bg-slate-900 text-white
                  "
                  >
                    <Award className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Achievements
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      Awards, competitions, and recognitions
                    </p>
                  </div>
                </li>

                <li
                  className="
                  flex items-start gap-3 rounded-xl border border-slate-200/70
                  bg-white/50 p-3
                "
                >
                  <span
                    className="
                    mt-0.5 inline-flex size-9 items-center justify-center
                    rounded-lg bg-slate-900 text-white
                  "
                  >
                    <FlaskConical className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Research highlights
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      Publications, projects, and labs
                    </p>
                  </div>
                </li>

                <li
                  className="
                  flex items-start gap-3 rounded-xl border border-slate-200/70
                  bg-white/50 p-3
                "
                >
                  <span
                    className="
                    mt-0.5 inline-flex size-9 items-center justify-center
                    rounded-lg bg-slate-900 text-white
                  "
                  >
                    <ImageIcon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Campus moments
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      Events and activities photo pages
                    </p>
                  </div>
                </li>
              </ul>

              <div
                className="
                mt-8 flex flex-col gap-3
                sm:flex-row sm:items-center
              "
              >
                <Link
                  href="/magazine"
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-full",
                    "bg-slate-900 px-6 py-3 text-sm font-semibold text-white",
                    "shadow-sm transition hover:bg-slate-800",
                    "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
                  ].join(" ")}
                >
                  View Magazine
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div
              className="
              flex items-center justify-center
              md:justify-end
            "
            >
              <div className="relative w-full max-w-sm">
                <div
                  className={[
                    "relative overflow-hidden rounded-2xl",
                    "border border-white/50 bg-white/55",
                    "backdrop-blur-xl",
                    "shadow-[0_20px_60px_-35px_rgba(15,23,42,0.60)]",
                  ].join(" ")}
                >
                  <div className="p-4">
                    <div
                      className="
                      relative aspect-3/4 w-full overflow-hidden rounded-xl border
                      border-slate-200/70 bg-slate-900 shadow-inner
                    "
                    >
                      <Image
                        src="/magazines/bodhika-cover.jpg"
                        alt="BODHIKA - SoIT Annual Magazine Cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover object-top transition duration-300 hover:scale-105"
                        priority
                      />

                      {/* Top Overlay Badge */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <div
                          className="
                          inline-flex items-center gap-1.5 rounded-full border
                          border-white/30 bg-slate-900/80 px-3 py-1 text-xs
                          font-semibold text-white backdrop-blur-md
                        "
                        >
                          <FileText className="size-3.5" />
                          Annual Edition
                        </div>
                        <div
                          className="
                          rounded-lg border border-white/30 bg-slate-900/80 p-1.5
                          text-white backdrop-blur-md
                        "
                        >
                          <BookOpen className="size-4" />
                        </div>
                      </div>

                      {/* Bottom Info Bar Overlay */}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex items-end justify-between text-white">
                        <div>
                          <p className="text-[11px] text-slate-300">Academic Year</p>
                          <p className="text-sm font-bold text-white">2025-26</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-slate-300">Format</p>
                          <p className="text-xs font-semibold text-white">Digital PDF</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className="
                        inline-flex items-center gap-2 rounded-full border
                        border-slate-200/70 bg-white/60 px-3 py-1 text-xs
                        font-semibold text-slate-700
                      "
                      >
                        <PenLine className="size-3.5" />
                        Student contributions
                      </span>
                      <span
                        className="
                        inline-flex items-center gap-2 rounded-full border
                        border-slate-200/70 bg-white/60 px-3 py-1 text-xs
                        font-semibold text-slate-700
                      "
                      >
                        <Award className="size-3.5" />
                        Year highlights
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="
                  pointer-events-none absolute -inset-6 -z-10 rounded-3xl
                  bg-slate-900/10 blur-2xl
                "
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="
          mt-8 grid grid-cols-1 gap-4
          md:grid-cols-3
        "
        >
          <div
            className="
            rounded-2xl border border-slate-200/70 bg-white/55 p-5 text-center
            backdrop-blur-xl
          "
          >
            <div
              className="
              mx-auto inline-flex size-10 items-center justify-center rounded-xl
              bg-slate-900 text-white
            "
            >
              <FileText className="size-5" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900">100+ pages</h4>
            <p className="mt-1 text-sm text-slate-600">
              A complete snapshot of the academic year.
            </p>
          </div>

          <div
            className="
            rounded-2xl border border-slate-200/70 bg-white/55 p-5 text-center
            backdrop-blur-xl
          "
          >
            <div
              className="
              mx-auto inline-flex size-10 items-center justify-center rounded-xl
              bg-slate-900 text-white
            "
            >
              <PenLine className="size-5" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900">
              Student contributors
            </h4>
            <p className="mt-1 text-sm text-slate-600">
              Written and curated with student participation.
            </p>
          </div>

          <div
            className="
            rounded-2xl border border-slate-200/70 bg-white/55 p-5 text-center
            backdrop-blur-xl
          "
          >
            <div
              className="
              mx-auto inline-flex size-10 items-center justify-center rounded-xl
              bg-slate-900 text-white
            "
            >
              <Download className="size-5" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-slate-900">Free download</h4>
            <p className="mt-1 text-sm text-slate-600">
              Accessible to everyone at no cost.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
