import { useRef, useEffect } from "react";

interface FloatingDotsProps {
  dotCount?: number;
}

export function FloatingDots({ dotCount = 40 }: FloatingDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Array<{
      x: number;
      y: number;
      r: number;
      alpha: number;
      driftAngle: number;
      dy: number;
    }> = [];

    const initDots = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      dots = Array.from({ length: dotCount }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.1 + Math.random() * 1.2,
        alpha: 0.2 + Math.random() * 0.2,
        driftAngle: Math.random() * Math.PI * 2,
        dy: -0.1 - Math.random() * 0.5,
      }));
    };

    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const animate = () => {
      const container = containerRef.current;
      if (!container || !canvas || !ctx) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        dot.driftAngle += (Math.random() - 0.5) * 0.13;
        const dx = Math.sin(dot.driftAngle) * 0.36;

        dot.x += dx;
        dot.y += dot.dy;

        if (dot.y + dot.r < 0) {
          dot.y = height + dot.r;
          dot.x = Math.random() * width;
        }
        if (dot.x < 0) dot.x = width;
        if (dot.x > width) dot.x = 0;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, 0.3)`;
        ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    initDots();
    resizeCanvas();
    animate();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      initDots();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [dotCount]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    >
      <canvas ref={canvasRef} className="w-full h-full" aria-hidden="true" />
    </div>
  );
}
