import React, { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';

const CanvasContainer = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1, // This ensures the canvas stays behind all other content
});

const Canvas = styled('canvas')({
  display: 'block',
  width: '100%',
  height: '100%',
});

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const { mode } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle settings
    const settings = {
      particleCount: 80,
      particleSizeMin: 1,
      particleSizeMax: 3,
      speedFactor: 0.3,
      connectionDistance: 150,
      backgroundColor: mode === 'dark' ? '#121212' : '#FFFFFF',
      particleColorDark: '#00BFFF', // Bright teal for dark mode
      particleColorLight: '#0D47A1' // Navy blue for light mode
    };

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < settings.particleCount; i++) {
        const particle: Particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * settings.speedFactor,
          vy: (Math.random() - 0.5) * settings.speedFactor,
          size: Math.random() * (settings.particleSizeMax - settings.particleSizeMin) + settings.particleSizeMin,
          opacity: Math.random() * 0.5 + 0.1,
          color: mode === 'dark' ? settings.particleColorDark : settings.particleColorLight
        };
        particlesRef.current.push(particle);
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = settings.backgroundColor + '60'; // Semi-transparent for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      // Draw connections
      ctx.beginPath();
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < settings.connectionDistance) {
            const opacity = 1 - (distance / settings.connectionDistance);
            ctx.strokeStyle = `${p1.color}${Math.floor(opacity * 128).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    createParticles();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [mode]); // Re-run when theme mode changes

  return (
    <CanvasContainer>
      <Canvas ref={canvasRef} />
    </CanvasContainer>
  );
};

export default BackgroundAnimation; 