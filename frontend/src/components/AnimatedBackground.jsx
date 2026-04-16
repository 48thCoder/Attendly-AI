
import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 68;
const CONNECTION_DIST = 140;
const PRIMARY = { r: 0, g: 255, b: 231 };    
const SECONDARY = { r: 0, g: 120, b: 255 };  

function randBetween(a, b) { return a + Math.random() * (b - a); }


export const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  const mouse     = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    
    let W, H;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    
    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);

    
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: randBetween(-0.18, 0.18),
      vy: randBetween(-0.18, 0.18),
      r: randBetween(1, 2.4),
      baseAlpha: randBetween(0.25, 0.7),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: randBetween(0.008, 0.022),
      color: Math.random() > 0.35 ? PRIMARY : SECONDARY,
    }));

    
    const auroras = [
      { cx: 0.15, cy: 0.20, rx: 0.32, ry: 0.22, color: PRIMARY,    alpha: 0.045, phase: 0   },
      { cx: 0.82, cy: 0.80, rx: 0.30, ry: 0.20, color: SECONDARY, alpha: 0.04,  phase: 1.5 },
      { cx: 0.50, cy: 0.10, rx: 0.20, ry: 0.12, color: PRIMARY,    alpha: 0.025, phase: 0.8 },
    ];

    
    let frame = 0;
    let raf;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;
      ctx.clearRect(0, 0, W, H);

      
      auroras.forEach(a => {
        a.phase += 0.005;
        const cx = (a.cx + Math.sin(a.phase * 0.7) * 0.04) * W;
        const cy = (a.cy + Math.cos(a.phase * 0.9) * 0.04) * H;
        const pulse = 1 + Math.sin(a.phase) * 0.12;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, a.rx * W * pulse);
        const { r, g, b } = a.color;
        grad.addColorStop(0,   `rgba(${r},${g},${b},${a.alpha})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${a.alpha * 0.4})`);
        grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, a.rx * W * pulse, a.ry * H * pulse, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      
      particles.forEach(p => {
        
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          const force = (90 - dist) / 90;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        
        p.pulse += p.pulseSpeed;
        const alpha = p.baseAlpha + Math.sin(p.pulse) * 0.15;

        const { r, g, b } = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();

        
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.4})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const opacity = (1 - d / CONNECTION_DIST) * 0.18;
            
            const { r: r1, g: g1, b: b1 } = a.color;
            ctx.strokeStyle = `rgba(${r1},${g1},${b1},${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 1,
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'radial-gradient(circle, rgba(0,255,231,0.07) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
    </>
  );
};
