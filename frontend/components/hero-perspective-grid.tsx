"use client";

import { useEffect, useRef } from "react";

const WIDTH = 1440;
const HEIGHT = 640;
const HORIZON = 170;
const ROWS = 32;
const SPACING = 0.72;

// Project evenly spaced floor lines into depth. Increasing depth moves each
// line toward the vanishing point; wrapping one cell makes the loop seamless.
function projectRow(index: number, offset = 0) {
  const depth = 0.7 + index * SPACING + offset;
  const y = HORIZON + 620 / depth;
  const horizonFade = Math.min(1, (y - HORIZON) / 150);
  const foregroundFade = Math.max(0, Math.min(1, (HEIGHT + 80 - y) / 160));
  return { y, opacity: horizonFade * foregroundFade * 0.36 };
}

export function HeroPerspectiveGrid() {
  const root = useRef<HTMLDivElement>(null);
  const rows = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;

    const paint = (offset: number) => {
      rows.current.forEach((line, index) => {
        if (!line) return;
        const { y, opacity } = projectRow(index, offset);
        line.setAttribute("y1", y.toFixed(3));
        line.setAttribute("y2", y.toFixed(3));
        line.setAttribute("opacity", opacity.toFixed(4));
      });
    };
    const animate = (now: number) => {
      if (previousTime) elapsed += Math.min(now - previousTime, 100);
      previousTime = now;
      paint(((elapsed / 1000) * 0.12) % SPACING);
      frame = requestAnimationFrame(animate);
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      previousTime = 0;
      const running = visible && !document.hidden && !reducedMotion.matches;
      element.dataset.running = String(running);
      if (reducedMotion.matches) paint(0);
      if (running) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    });
    observer.observe(element);
    reducedMotion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      cancelAnimationFrame(frame);
      element.dataset.running = "false";
      observer.disconnect();
      reducedMotion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  return (
    <div className="ss-perspective-grid" ref={root} aria-hidden="true">
      <div className="ss-grid-horizon" />
      <svg
        className="ss-grid-lines"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        fill="none"
        focusable="false"
      >
        {Array.from({ length: 37 }, (_, index) => {
          const column = index - 18;
          return (
            <line
              key={`column-${column}`}
              x1={WIDTH / 2}
              y1={HORIZON}
              x2={WIDTH / 2 + column * 160}
              y2={HEIGHT + 100}
              opacity={column % 4 === 0 ? 0.36 : 0.25}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {Array.from({ length: ROWS }, (_, index) => {
          const { y, opacity } = projectRow(index);
          return (
            <line
              key={`row-${index}`}
              ref={(line) => {
                rows.current[index] = line;
              }}
              x1={0}
              x2={WIDTH}
              y1={y}
              y2={y}
              opacity={opacity}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="ss-grid-copy-shield" />
    </div>
  );
}
