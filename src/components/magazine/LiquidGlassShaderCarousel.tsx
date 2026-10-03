"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PolaroidMoment } from "./data/magazineData";

const categoryColorMap: Record<string, { hex: string; glow: string; name: string }> = {
  "Fest Vibes": { hex: "#F59E0B", glow: "rgba(245, 158, 11, 0.45)", name: "Fest Vibes" },
  "Hackathon Rush": { hex: "#6366F1", glow: "rgba(99, 102, 241, 0.45)", name: "Hackathon Rush" },
  "Late-Night Coding": { hex: "#10B981", glow: "rgba(16, 185, 129, 0.45)", name: "Late-Night Coding" },
  "Campus Chai": { hex: "#B0182F", glow: "rgba(176, 24, 47, 0.45)", name: "Campus Chai" },
  "Lab Life": { hex: "#A855F7", glow: "rgba(168, 85, 247, 0.45)", name: "Lab Life" },
  "Convocation Day": { hex: "#EAB308", glow: "rgba(234, 179, 8, 0.45)", name: "Convocation Day" },
};

const DEFAULT_CATEGORY_COLOR = {
  hex: "#B0182F",
  glow: "rgba(176, 24, 47, 0.35)",
  name: "Campus Moment",
};

interface LiquidGlassShaderCarouselProps {
  moments: PolaroidMoment[];
  activeFilter?: string;
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  attribute vec2 a_uv;
  
  uniform vec2 u_resolution;
  uniform vec2 u_cardPos;
  uniform vec2 u_cardSize;
  uniform float u_distFromCenter;
  
  varying vec2 v_uv;
  varying float v_distFromCenter;
  
  void main() {
    v_uv = a_uv;
    v_distFromCenter = u_distFromCenter;
    
    // Scale card slightly if centered
    float scale = 1.0 - clamp(abs(u_distFromCenter) * 0.04, 0.0, 0.15);
    vec2 scaledSize = u_cardSize * scale;
    
    // Card quad position in screen pixels
    vec2 pixelPos = u_cardPos + (a_position - 0.5) * scaledSize;
    
    // Slight vertical curvature on side cards (gentle concave arc)
    float arcOffset = pow(abs(u_distFromCenter), 2.0) * 4.0;
    pixelPos.y += arcOffset;
    
    // Convert from pixel space to clip space [-1, 1]
    vec2 clipSpace = (pixelPos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y; // Invert Y for WebGL
    
    gl_Position = vec4(clipSpace, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;
  
  uniform sampler2D u_texture;
  uniform float u_distFromCenter;
  uniform vec2 u_cardSize;
  uniform float u_imageAspect;
  uniform float u_cardAspect;
  
  varying vec2 v_uv;
  varying float v_distFromCenter;
  
  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }
  
  void main() {
    float dist = v_distFromCenter;
    float absDist = abs(dist);
    float signDist = sign(dist);
    
    // Calculate non-linear barrel/cylindrical glass warp factor
    // Center card (dist=0) has 0 warp -> perfectly flat and sharp
    float warpStrength = pow(clamp(absDist / 2.2, 0.0, 1.0), 1.5) * 0.38 * signDist;
    
    vec2 uv = v_uv;
    
    // 1. Horizontal Cylinder/Barrel Lens Curve
    float cx = uv.x - 0.5;
    float bendCurve = (1.0 - cos(cx * 3.14159265)) * warpStrength;
    float warpedU = uv.x + bendCurve * 0.95;
    
    // 2. Vertical Edge Sag / Lens Curvature
    float cy = uv.y - 0.5;
    float edgeSag = pow(cx, 2.0) * abs(warpStrength) * 0.55;
    float warpedV = cy * (1.0 + edgeSag) + 0.5;
    
    vec2 warpedUV = vec2(warpedU, warpedV);
    
    // 3. Object-fit: cover mapping for texture coordinates
    vec2 texUV = warpedUV;
    if (u_imageAspect > u_cardAspect) {
      float scale = u_cardAspect / u_imageAspect;
      texUV.x = (texUV.x - 0.5) * scale + 0.5;
    } else {
      float scale = u_imageAspect / u_cardAspect;
      texUV.y = (texUV.y - 0.5) * scale + 0.5;
    }
    
    // 4. Chromatic Aberration / Rainbow Dispersion Fringe on Distorted Edges
    float dispersion = abs(warpStrength) * 0.038;
    float r = texture2D(u_texture, vec2(texUV.x - dispersion * signDist, texUV.y)).r;
    float g = texture2D(u_texture, texUV).g;
    float b = texture2D(u_texture, vec2(texUV.x + dispersion * signDist, texUV.y)).b;
    vec3 color = vec3(r, g, b);
    
    // 5. Dynamic Specular Highlight / Glass Edge Refraction
    float edgeDistance = min(warpedUV.x, min(1.0 - warpedUV.x, min(warpedUV.y, 1.0 - warpedUV.y)));
    float specularRim = pow(clamp(1.0 - edgeDistance * 12.0, 0.0, 1.0), 2.5) * abs(warpStrength) * 0.65;
    
    color += vec3(specularRim * 1.15, specularRim * 1.0, specularRim * 1.35);
    
    // 6. Rounded corners with smooth antialiasing
    vec2 halfSize = u_cardSize * 0.5;
    vec2 pixelPos = (v_uv - 0.5) * u_cardSize;
    float cornerRadius = 24.0;
    float d = roundedBoxSDF(pixelPos, halfSize, cornerRadius);
    float alpha = 1.0 - smoothstep(0.0, 1.5, d);
    
    // Discard outside warped bounds
    if (warpedUV.x < 0.0 || warpedUV.x > 1.0 || warpedUV.y < 0.0 || warpedUV.y > 1.0) {
      alpha = 0.0;
    }
    
    float vignette = 1.0 - absDist * 0.08;
    color *= vignette;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function LiquidGlassShaderCarousel({
  moments,
  activeFilter = "All",
}: LiquidGlassShaderCarouselProps) {
  const filteredMoments =
    activeFilter === "All"
      ? moments
      : moments.filter((m) => m.moodTag === activeFilter);

  const displayList = filteredMoments.length > 0 ? filteredMoments : moments;
  const count = displayList.length;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const scrollPosRef = useRef<number>(0);
  const targetPosRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastDragXRef = useRef<number>(0);
  const lastDragTimeRef = useRef<number>(0);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [webglFailed, setWebglFailed] = useState<boolean>(false);
  const [activeOffset, setActiveOffset] = useState<number>(0);

  const webglStateRef = useRef<{
    gl: WebGLRenderingContext | null;
    program: WebGLProgram | null;
    textures: Map<string, { texture: WebGLTexture; aspect: number }>;
    positionBuffer: WebGLBuffer | null;
    uvBuffer: WebGLBuffer | null;
    attribs: Record<string, number>;
    uniforms: Record<string, WebGLUniformLocation | null>;
  }>({
    gl: null,
    program: null,
    textures: new Map(),
    positionBuffer: null,
    uvBuffer: null,
    attribs: {},
    uniforms: {},
  });

  const activeMoment = displayList[activeIndex] || displayList[0];
  const activeCategory = (activeMoment?.moodTag && categoryColorMap[activeMoment.moodTag]) || DEFAULT_CATEGORY_COLOR;

  useEffect(() => {
    targetPosRef.current = 0;
    scrollPosRef.current = 0;
    setActiveIndex(0);
  }, [activeFilter]);

  const goToNext = useCallback(() => {
    const next = (activeIndex + 1) % count;
    targetPosRef.current = next;
    setActiveIndex(next);
  }, [activeIndex, count]);

  const goToPrev = useCallback(() => {
    const prev = (activeIndex - 1 + count) % count;
    targetPosRef.current = prev;
    setActiveIndex(prev);
  }, [activeIndex, count]);

  const goToIndex = useCallback((idx: number) => {
    targetPosRef.current = idx;
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      (canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null);

    if (!gl) {
      setWebglFailed(true);
      return;
    }

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertShader || !fragShader) {
      setWebglFailed(true);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(program));
      setWebglFailed(true);
      return;
    }

    const positions = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);

    const uvs = new Float32Array([
      0, 0,
      1, 0,
      0, 1,
      0, 1,
      1, 0,
      1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    const attribs = {
      a_position: gl.getAttribLocation(program, "a_position"),
      a_uv: gl.getAttribLocation(program, "a_uv"),
    };

    const uniforms = {
      u_resolution: gl.getUniformLocation(program, "u_resolution"),
      u_cardPos: gl.getUniformLocation(program, "u_cardPos"),
      u_cardSize: gl.getUniformLocation(program, "u_cardSize"),
      u_distFromCenter: gl.getUniformLocation(program, "u_distFromCenter"),
      u_texture: gl.getUniformLocation(program, "u_texture"),
      u_imageAspect: gl.getUniformLocation(program, "u_imageAspect"),
      u_cardAspect: gl.getUniformLocation(program, "u_cardAspect"),
    };

    webglStateRef.current = {
      gl,
      program,
      textures: new Map(),
      positionBuffer,
      uvBuffer,
      attribs,
      uniforms,
    };

    displayList.forEach((moment) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = moment.image;
      img.onload = () => {
        if (!gl) return;
        const texture = gl.createTexture();
        if (!texture) return;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        const aspect = img.width / img.height || 1.33;
        webglStateRef.current.textures.set(moment.image, { texture, aspect });
      };
    });

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (gl) {
        webglStateRef.current.textures.forEach(({ texture }) => gl.deleteTexture(texture));
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (uvBuffer) gl.deleteBuffer(uvBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [displayList]);

  useEffect(() => {
    const render = () => {
      const canvas = canvasRef.current;
      const { gl, program, positionBuffer, uvBuffer, attribs, uniforms } =
        webglStateRef.current;

      if (
        !canvas ||
        !gl ||
        !program ||
        !positionBuffer ||
        !uvBuffer ||
        attribs.a_position === undefined ||
        attribs.a_uv === undefined ||
        !uniforms.u_resolution ||
        !uniforms.u_cardSize ||
        !uniforms.u_cardAspect ||
        !uniforms.u_cardPos ||
        !uniforms.u_distFromCenter ||
        !uniforms.u_texture ||
        !uniforms.u_imageAspect
      ) {
        animFrameIdRef.current = requestAnimationFrame(render);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.floor(rect.width * dpr);
      const height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }

      if (isDraggingRef.current) {
        scrollPosRef.current += (targetPosRef.current - scrollPosRef.current) * 0.35;
      } else {
        scrollPosRef.current += velocityRef.current;
        velocityRef.current *= 0.92;

        if (Math.abs(velocityRef.current) < 0.002) {
          const diff = targetPosRef.current - scrollPosRef.current;
          scrollPosRef.current += diff * 0.12;

          const nearest = Math.round(scrollPosRef.current);
          const normalized = ((nearest % count) + count) % count;
          if (normalized !== activeIndex && Math.abs(diff) < 0.05) {
            setActiveIndex(normalized);
          }
        } else {
          const nearest = Math.round(scrollPosRef.current);
          targetPosRef.current = nearest;
        }
      }

      const currentScroll = scrollPosRef.current;
      const nearestInt = Math.round(currentScroll);
      setActiveOffset(Math.abs(currentScroll - nearestInt));

      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform2f(uniforms.u_resolution, rect.width, rect.height);

      const cardWidth = Math.min(rect.width * 0.38, 320);
      const cardHeight = Math.min(rect.height * 0.85, 410);
      const cardSpacing = cardWidth * 1.08;
      const cardAspect = cardWidth / cardHeight;

      gl.uniform2f(uniforms.u_cardSize, cardWidth, cardHeight);
      gl.uniform1f(uniforms.u_cardAspect, cardAspect);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(attribs.a_position);
      gl.vertexAttribPointer(attribs.a_position, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(attribs.a_uv);
      gl.vertexAttribPointer(attribs.a_uv, 2, gl.FLOAT, false, 0, 0);

      const centerX = rect.width * 0.5;
      const centerY = rect.height * 0.5;

      displayList.forEach((moment, idx) => {
        let delta = idx - currentScroll;
        
        while (delta > count / 2) delta -= count;
        while (delta < -count / 2) delta += count;

        if (Math.abs(delta) > 2.6) return;

        const posX = centerX + delta * cardSpacing;
        const posY = centerY;

        gl.uniform2f(uniforms.u_cardPos!, posX, posY);
        gl.uniform1f(uniforms.u_distFromCenter!, delta);

        const texData = webglStateRef.current.textures.get(moment.image);
        if (texData) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, texData.texture);
          gl.uniform1i(uniforms.u_texture!, 0);
          gl.uniform1f(uniforms.u_imageAspect!, texData.aspect);

          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
      });

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [displayList, count, activeIndex]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const now = performance.now();
    const dt = Math.max(now - lastDragTimeRef.current, 8);
    const dx = e.clientX - lastDragXRef.current;

    const rect = containerRef.current?.getBoundingClientRect();
    const cardWidth = rect ? Math.min(rect.width * 0.38, 320) : 300;
    const cardDelta = (-dx / cardWidth) * 1.15;

    targetPosRef.current += cardDelta;
    velocityRef.current = (cardDelta / dt) * 14;

    lastDragXRef.current = e.clientX;
    lastDragTimeRef.current = now;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    const projectedPos = scrollPosRef.current + velocityRef.current * 12;
    const nearest = Math.round(projectedPos);
    targetPosRef.current = nearest;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
      e.preventDefault();
      targetPosRef.current += (e.deltaX / 300) * 0.6;
    }
  };

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const centerX = rect.width * 0.5;
    const cardWidth = Math.min(rect.width * 0.38, 320);

    const deltaX = clickX - centerX;
    if (Math.abs(deltaX) > cardWidth * 0.4) {
      const step = deltaX > 0 ? 1 : -1;
      targetPosRef.current = Math.round(scrollPosRef.current) + step;
    } else {
      // Center card clicked -> open magazine read page 24
      router.push("/magazine/read?page=24");
    }
  };

  const captionOpacity = Math.max(0, 1 - activeOffset * 2.8);

  return (
    <div className="relative w-full max-w-7xl my-6 sm:my-8 mb-12 py-7 sm:py-10 px-2 sm:px-4 bg-gradient-to-b from-white to-[#F6F5F2] rounded-3xl sm:rounded-[36px] border border-white/95 shadow-[0_30px_80px_-20px_rgba(70,10,20,0.18),0_10px_30px_-10px_rgba(0,0,0,0.08),inset_0_2px_3px_rgba(255,255,255,1),inset_0_-2px_6px_rgba(0,0,0,0.03)] overflow-hidden select-none" onWheel={handleWheel}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,_rgba(244,168,59,0.08)_0%,_transparent_60%),radial-gradient(circle_at_50%_80%,_rgba(176,24,47,0.05)_0%,_transparent_60%)] opacity-80 z-10" />

      <div
        ref={containerRef}
        className="relative w-full h-[350px] sm:h-[400px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing z-10 touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleCardClick}
      >
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-80 h-10 rounded-full blur-[28px] pointer-events-none z-10 transition-all duration-450 ease-out"
          style={{
            backgroundColor: activeCategory.glow,
            opacity: captionOpacity,
          }}
        />

        {!webglFailed ? (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block z-10 pointer-events-none" />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center [perspective:1200px]">
            {displayList.map((moment, i) => {
              const delta = i - activeIndex;
              if (Math.abs(delta) > 2) return null;
              return (
                <div
                  key={moment.id}
                  className="absolute w-[280px] h-[380px] rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.12)] transition-all duration-400 ease-out"
                  style={{
                    transform: `translateX(${delta * 300}px) scale(${
                      1 - Math.abs(delta) * 0.12
                    }) rotateY(${delta * -18}deg)`,
                    opacity: 1 - Math.abs(delta) * 0.25,
                    zIndex: 20 - Math.abs(delta) * 5,
                  }}
                >
                  <Image
                    src={moment.image}
                    alt={moment.title}
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="relative max-w-xl mx-auto mt-5 text-center z-10 transition-all duration-250 ease-out min-h-[95px] flex flex-col items-center justify-center px-4"
        style={{
          opacity: captionOpacity,
          transform: `translateY(${(1 - captionOpacity) * 8}px)`,
        }}
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-extrabold uppercase tracking-wider bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] border border-black/6 mb-2.5 transition-all duration-300">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: activeCategory.hex }}
          />
          <span style={{ color: "#333333" }}>{activeMoment?.moodTag}</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <span className="text-sm font-bold text-[#B0182F]">{activeMoment?.hindiTitle}</span>
          <span className="text-stone-400 font-light">|</span>
          <h3 className="text-xl font-extrabold text-neutral-900 font-serif">{activeMoment?.title}</h3>
        </div>

        <p className="text-sm text-neutral-600 italic mt-1.5 leading-relaxed max-w-md">“{activeMoment?.caption}”</p>
        <span className="text-[0.72rem] font-bold text-[#8C7A6B] uppercase tracking-wider mt-1.5">{activeMoment?.date}</span>
      </div>

      <div className="flex items-center justify-center gap-5 mt-5 z-10 relative">
        <button
          type="button"
          aria-label="Previous photo"
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-black/8 shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] text-neutral-800 cursor-pointer transition-all duration-250 hover:bg-[#B0182F] hover:text-white hover:border-[#B0182F] hover:scale-108 hover:shadow-[0_8px_24px_rgba(176,24,47,0.25)] active:scale-95"
          onClick={goToPrev}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/4 border border-black/6">
          {displayList.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              aria-label={`Go to image ${idx + 1}`}
              className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 ${
                idx === activeIndex
                  ? "w-6 bg-[#B0182F] shadow-[0_0_10px_rgba(176,24,47,0.4)]"
                  : "w-1.5 bg-black/20 hover:bg-black/40"
              }`}
              onClick={() => goToIndex(idx)}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next photo"
          className="w-11 h-11 rounded-full flex items-center justify-center bg-white border border-black/8 shadow-[0_4px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] text-neutral-800 cursor-pointer transition-all duration-250 hover:bg-[#B0182F] hover:text-white hover:border-[#B0182F] hover:scale-108 hover:shadow-[0_8px_24px_rgba(176,24,47,0.25)] active:scale-95"
          onClick={goToNext}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

