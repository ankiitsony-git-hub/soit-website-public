import { useState, useRef, useCallback } from "react";

export function useBook3DTilt(defaultY = 10) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: defaultY });
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 8 + defaultY;
      const rotateX = -((y - centerY) / centerY) * 7;

      setRotate({ x: rotateX, y: rotateY });
      setGlarePos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.35,
      });
    },
    [defaultY]
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: defaultY });
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, [defaultY]);

  return {
    cardRef,
    rotate,
    isHovered,
    glarePos,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
  };
}
