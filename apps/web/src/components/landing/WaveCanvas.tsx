'use client';

import React, { useRef, useEffect } from 'react';

interface WaveCanvasProps {
  density?: 'high' | 'low';
}

export function WaveCanvas({ density = 'high' }: WaveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Mouse state
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 150
    };

    // Handle resize
    const setCanvasSize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        initParticles();
      }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        // Diagonal movement speed ~0.7
        this.vx = (Math.random() - 0.2) * 0.7; // slight bias to move right
        this.vy = (Math.random() - 0.2) * 0.7; // slight bias to move down
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < -50) this.x = canvas!.width + 50;
        if (this.x > canvas!.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas!.height + 50;
        if (this.y > canvas!.height + 50) this.y = -50;

        // Interaction with mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          
          // Pull slightly toward cursor
          const pullStrength = 0.5;
          this.x += forceDirectionX * force * pullStrength;
          this.y += forceDirectionY * force * pullStrength;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = 'rgba(204, 0, 0, 0.4)'; // brand-red with opacity
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = density === 'high' ? 
        (canvas.width * canvas.height) / 12000 : 
        (canvas.width * canvas.height) / 25000;
        
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push(new Particle(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (!p1) continue;
        
        p1.update();
        p1.draw();

        for (let j = i; j < particles.length; j++) {
          const p2 = particles[j];
          if (!p2) continue;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            // Check if this line is close to mouse for brighter opacity
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const mouseDist = Math.sqrt(
              Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2)
            );

            const opacity = mouseDist < mouse.radius ? 0.28 : 0.18;
            
            ctx.beginPath();
            ctx.strokeStyle = `rgba(204, 0, 0, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', setCanvasSize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Initial setup
    setCanvasSize();
    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ background: 'transparent' }}
    />
  );
}
