import { useEffect, useRef, useState } from "react";
import {
  Scan,
  Zap,
  Shield,
  Brain,
  Users,
  Clock,
  ChevronRight,
  Activity,
  Eye,
  Lock,
  BarChart3,
  Cpu,
  Wifi,
} from "lucide-react";

const GRID_COLOR = "rgba(0,255,255,0.04)";

function GridBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        style={{
          backgroundImage: `linear-gradient(${GRID_COLOR} 1px, transparent 1px), linear-gradient(90deg, ${GRID_COLOR} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        className="absolute inset-0"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#0d0d24] to-[#0a0a1a]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[100px]" />
    </div>
  );
}

function ScanVisual() {
  const [scanPos, setScanPos] = useState(0);
  const [dots, setDots] = useState([]);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const newDots = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 2000,
    }));
    setDots(newDots);

    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % 3000;
      setScanPos((elapsed / 3000) * 100);
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-4 rounded-full border border-cyan-400/10" />

      {/* Main face frame */}
      <div
        className="absolute inset-8 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,255,0.04) 0%, rgba(139,92,246,0.04) 100%)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,255,255,0.15)",
          boxShadow: "0 0 40px rgba(0,255,255,0.08), inset 0 0 40px rgba(0,255,255,0.03)",
        }}
      >
        {/* Corner brackets */}
        {["top-2 left-2", "top-2 right-2 rotate-90", "bottom-2 right-2 rotate-180", "bottom-2 left-2 -rotate-90"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-400" />
          </div>
        ))}

        {/* Scan line */}
        <div
          className="absolute left-0 right-0 h-[2px] transition-none"
          style={{
            top: `${scanPos}%`,
            background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)",
            boxShadow: "0 0 12px rgba(0,255,255,0.6)",
          }}
        />

        {/* Dots */}
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-cyan-400 animate-pulse"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              animationDelay: `${dot.delay}ms`,
              opacity: 0.6,
            }}
          />
        ))}

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
            <Scan className="relative text-cyan-400 w-12 h-12 md:w-16 md:h-16" strokeWidth={1} />
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 whitespace-nowrap"
        style={{
          background: "rgba(0,255,255,0.08)",
          border: "1px solid rgba(0,255,255,0.2)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="inline-block w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse" />
        FACIAL RECOGNITION ACTIVE
      </div>
    </div>
  );
}

function StatCard({ value, label, icon: Icon, color }) {
  return (
    <div
      className="relative group px-6 py-5 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} blur-2xl`} />
      <div className="relative flex items-center gap-4">
        <div
          className="p-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Icon className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="text-2xl font-bold text-white font-mono">{value}</div>
          <div className="text-xs text-slate-400 mt-0.5">{label}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent }) {
  return (
    <div
      className="group relative p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-default"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at top left, ${accent}10 0%, transparent 70%)` }}
      />
      <div
        className="inline-flex p-3 rounded-xl mb-4"
        style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
      >
        <Icon className="w-5 h-5" style={{ color: accent }} />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Hero */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 mb-6"
                style={{ background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.2)" }}
              >
                <Activity className="w-3 h-3" />
                POWERED BY GEMINI AI + FACE-API.JS
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6 tracking-tight">
                <span className="text-white">Attendance,</span>
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #00ffff, #8b5cf6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Redefined.
                </span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                Attendly AI replaces manual roll calls with instant facial biometrics—98.7% accurate, real-time anomaly alerts, and zero friction.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  className="group flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]"
                  style={{ background: "linear-gradient(135deg, #00ffff, #00d4ff)" }}
                >
                  Start Free Trial
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-300 transition-all duration-300 hover:text-white"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <Eye className="w-4 h-4" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right – Scan Visual */}
            <div className="flex-1 flex justify-center">
              <ScanVisual />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "98.7%", label: "Recognition Accuracy", icon: Activity, color: "from-cyan-500/5" },
            { value: "<0.3s", label: "Scan Speed", icon: Zap, color: "from-violet-500/5" },
            { value: "50K+", label: "Daily Scans", icon: Users, color: "from-cyan-500/5" },
            { value: "99.9%", label: "Uptime SLA", icon: Clock, color: "from-violet-500/5" },
          ].map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Intelligence at Every Layer</h2>
            <p className="text-slate-400">Built for scale. Designed for precision.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: "Gemini Anomaly Detection", desc: "AI flags ghost attendance, proxy attempts, and unusual patterns in real time using Gemini's multimodal reasoning.", accent: "#8b5cf6" },
              { icon: Scan, title: "Face-API.js Biometrics", desc: "Lightweight, browser-native facial landmark detection with liveness checks to prevent spoofing.", accent: "#00ffff" },
              { icon: Shield, title: "Zero-Trust Security", desc: "End-to-end AES-256 encryption. Face embeddings never leave your infrastructure.", accent: "#8b5cf6" },
              { icon: BarChart3, title: "Live Analytics Dashboard", desc: "Real-time attendance heatmaps, trend graphs, and exportable reports with one click.", accent: "#00ffff" },
              { icon: Cpu, title: "Edge-Ready Architecture", desc: "Runs on commodity hardware. No GPU required for deployment, powered by WebAssembly.", accent: "#8b5cf6" },
              { icon: Wifi, title: "Offline-First Mode", desc: "Scans cache locally and sync when connection resumes. Works in low-bandwidth environments.", accent: "#00ffff" },
            ].map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,255,0.06) 0%, rgba(139,92,246,0.08) 100%)",
              border: "1px solid rgba(0,255,255,0.15)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready to go passwordless?</h2>
            <p className="text-slate-400 mb-8">Join 200+ institutions using Attendly AI. Setup takes under 10 minutes.</p>
            <button
              className="px-8 py-3.5 rounded-xl font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.4)]"
              style={{ background: "linear-gradient(135deg, #00ffff, #8b5cf6)" }}
            >
              Deploy Attendly AI →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
