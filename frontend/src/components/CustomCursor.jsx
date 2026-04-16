
import { useEffect, useRef, useState } from 'react';


export const CustomCursor = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  
  const ringPos  = useRef({ x: -100, y: -100 });
  const mousePos = useRef({ x: -100, y: -100 });
  const rafId    = useRef(null);

  const [hovering,  setHovering]  = useState(false);
  const [clicking,  setClicking]  = useState(false);
  const [ripples,   setRipples]   = useState([]);

  
  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isHover = el?.closest(
        'button, a, input, select, textarea, label, [role="button"], [tabindex]'
      );
      setHovering(!!isHover);
    };

    const onDown = (e) => {
      setClicking(true);
      const id = Date.now();
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    };

    const onUp   = () => setClicking(false);
    const onLeave = () => {
      mousePos.current = { x: -200, y: -200 };
      ringPos.current  = { x: -200, y: -200 };
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    document.documentElement.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  
  useEffect(() => {
    const ease = 0.12;
    const animate = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };
    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  
  useEffect(() => {
    document.documentElement.style.cursor = 'none';
    return () => { document.documentElement.style.cursor = ''; };
  }, []);

  const ringSize   = hovering ? 44 : clicking ? 20 : 32;
  const ringOpacity = hovering ? 1 : 0.7;
  const dotSize    = hovering ? 4 : 6;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 99999,
          pointerEvents: 'none',
          width:  `${dotSize}px`,
          height: `${dotSize}px`,
          marginLeft: `-${dotSize / 2}px`,
          marginTop:  `-${dotSize / 2}px`,
          borderRadius: '50%',
          background: hovering ? 'transparent' : '#00ffe7',
          boxShadow: hovering ? 'none' : '0 0 8px 2px rgba(0,255,231,0.7)',
          transition: 'width 0.2s, height 0.2s, background 0.2s, box-shadow 0.2s',
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          zIndex: 99998,
          pointerEvents: 'none',
          width:  `${ringSize}px`,
          height: `${ringSize}px`,
          marginLeft: `-${ringSize / 2}px`,
          marginTop:  `-${ringSize / 2}px`,
          borderRadius: '50%',
          border: `1.5px solid rgba(0,255,231,${ringOpacity})`,
          boxShadow: hovering
            ? '0 0 16px 4px rgba(0,255,231,0.35), inset 0 0 8px rgba(0,255,231,0.1)'
            : '0 0 6px rgba(0,255,231,0.25)',
          backdropFilter: hovering ? 'blur(1px)' : 'none',
          transition: 'width 0.25s cubic-bezier(.34,1.56,.64,1), height 0.25s cubic-bezier(.34,1.56,.64,1), border-color 0.2s, box-shadow 0.2s, opacity 0.2s',
          willChange: 'transform',
        }}
      >
        {hovering && (
          <>
            <div style={{ position:'absolute', top:'50%', left:'20%', right:'20%', height:'1px', background:'rgba(0,255,231,0.35)', transform:'translateY(-50%)' }} />
            <div style={{ position:'absolute', left:'50%', top:'20%', bottom:'20%', width:'1px', background:'rgba(0,255,231,0.35)', transform:'translateX(-50%)' }} />
          </>
        )}
      </div>
      {ripples.map(r => (
        <div
          key={r.id}
          style={{
            position: 'fixed',
            top: r.y, left: r.x,
            zIndex: 99997,
            pointerEvents: 'none',
            width: '8px', height: '8px',
            marginLeft: '-4px', marginTop: '-4px',
            borderRadius: '50%',
            border: '1.5px solid rgba(0,255,231,0.8)',
            animation: 'cursorRipple 0.65s ease-out forwards',
          }}
        />
      ))}
    </>
  );
};
