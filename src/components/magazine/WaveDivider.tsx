import React from "react";

interface WaveDividerProps {
  direction?: "down" | "up";
  accentColor?: string;
  className?: string;
  variant?: "maroon-to-amber" | "amber-to-maroon" | "soft-cream" | "editorial";
}

export default function WaveDivider({
  direction = "down",
  className = "",
  variant = "maroon-to-amber",
}: WaveDividerProps) {
  const isUp = direction === "up";

  // Gradients for different transitions
  const gradientMap = {
    "maroon-to-amber": {
      stroke1: "#7A1229",
      stroke2: "#B0182F",
      stroke3: "#E54F38",
      stroke4: "#F4A83B",
      stroke5: "#FBB940",
    },
    "amber-to-maroon": {
      stroke1: "#F4A83B",
      stroke2: "#E54F38",
      stroke3: "#B0182F",
      stroke4: "#7A1229",
      stroke5: "#5A0B1D",
    },
    "soft-cream": {
      stroke1: "#FAF9FB",
      stroke2: "#EBD3C9",
      stroke3: "#D9B8AC",
      stroke4: "#F4A83B",
      stroke5: "#7A1229",
    },
    editorial: {
      stroke1: "#500B1B",
      stroke2: "#7A1229",
      stroke3: "#A31A33",
      stroke4: "#D64230",
      stroke5: "#F4A83B",
    },
  };

  const colors = gradientMap[variant] || gradientMap["maroon-to-amber"];

  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none z-10 ${isUp ? "transform rotate-180 -mt-1" : "-mb-1"
        } ${className}`}
      style={{ height: "70px" }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-20 60 C 260 120, 520 -10, 880 70 C 1140 130, 1340 40, 1460 30"
          stroke={colors.stroke1}
          strokeWidth="32"
          strokeLinecap="round"
          strokeOpacity="0.35"
        />
        <path
          d="M-10 75 C 280 135, 540 5, 900 85 C 1160 145, 1360 55, 1470 45"
          stroke={colors.stroke2}
          strokeWidth="24"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />
        <path
          d="M0 90 C 300 150, 560 20, 920 100 C 1180 160, 1380 70, 1480 60"
          stroke={colors.stroke3}
          strokeWidth="16"
          strokeLinecap="round"
          strokeOpacity="0.55"
        />
        <path
          d="M10 102 C 320 162, 580 32, 940 112 C 1200 172, 1400 82, 1490 72"
          stroke={colors.stroke4}
          strokeWidth="10"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />
        <path
          d="M20 112 C 340 172, 600 42, 960 122 C 1220 182, 1420 92, 1500 82"
          stroke={colors.stroke5}
          strokeWidth="5"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />
      </svg>
    </div>
  );
}
