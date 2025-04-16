"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMousePosition } from "../../lib/hooks/useMousePosition";
import { cn } from "../../lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  life: number;
  opacity: number;
}

interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  particleSpeed?: number;
  particleLife?: number;
}

export const SparklesCore: React.FC<SparklesCoreProps> = ({
  id = "tsparticles",
  className = "",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  particleColor = "#FFF",
  particleSpeed = 1,
  particleLife = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mousePosition = useMousePosition();
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticle = (x: number, y: number): Particle => ({
      id: Math.random(),
      x,
      y,
      size: Math.random() * (maxSize - minSize) + minSize,
      color: particleColor,
      speed: Math.random() * particleSpeed,
      life: Math.random() * particleLife,
      opacity: 1,
    });

    const updateParticles = () => {
      setParticles((prevParticles) => {
        const newParticles = [...prevParticles];
        
        // Update existing particles
        for (let i = newParticles.length - 1; i >= 0; i--) {
          const particle = newParticles[i];
          particle.life -= 0.01;
          particle.opacity = particle.life;
          
          if (particle.life <= 0) {
            newParticles.splice(i, 1);
          }
        }

        // Add new particles near mouse position
        if (mousePosition.x !== null && mousePosition.y !== null) {
          for (let i = 0; i < particleDensity / 10; i++) {
            const x = mousePosition.x + (Math.random() - 0.5) * 50;
            const y = mousePosition.y + (Math.random() - 0.5) * 50;
            newParticles.push(createParticle(x, y));
          }
        }

        return newParticles;
      });
    };

    const render = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, "0")}`;
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [background, maxSize, minSize, mousePosition, particleColor, particleDensity, particleLife, particleSpeed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}; 