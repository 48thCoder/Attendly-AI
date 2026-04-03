// ─────────────────────────────────────────────────────────────────────────────
// ALL IMPORTS MUST BE AT THE TOP — no mid-file imports allowed in React/Vite
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import {
  // Layout / Nav
  Scan, Menu, X, ChevronRight,
  // Home page
  Activity, Eye, Lock, BarChart3, Cpu, Wifi, Zap, Brain, Shield, Users, Clock,
  // About page
  ArrowRight, AlertTriangle, CheckCircle2, Database, Layers, Server, Monitor,
  // Contact page
  Mail, MessageSquare, User, Building2, Send, Bot, Phone, MapPin,
  // Shared
  BarChart3 as BarChart, // alias to avoid duplicate name warning — use BarChart3 everywhere
} from "lucide-react";

// NOTE: Twitter, Github, Linkedin are REMOVED — lucide deprecated all brand logos.
// We use inline SVGs below instead (see socialLinks).

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL LINKS — inline SVG (brand-safe, no deprecated lucide icons)
// ─────────────────────────────────────────────────────────────────────────────
const socialLinks = [
  {
    label: "X (Twitter)",
    accent: "#00ffff",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    accent: "#8b5cf6",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    accent: "#00ffff",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GRID BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#07071a] via-[#0a0a20] to-[#07071a]" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[100px]" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage }) {
  const [open, setOpen] = useState(false);
  const links = ["Home", "About", "Contact"];

  return (
    <nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl px-5 py-3 rounded-2xl flex items-center justify-between"
      style={{
        background: "rgba(7,7,26,0.7)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
      }}
    >
      {/* Logo */}
      <button className="flex items-center gap-2.5" onClick={() => setPage("Home")}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, rgba(0,255,255,0.2), rgba(139,92,246,0.2))",
            border: "1px solid rgba(0,255,255,0.3)",
            boxShadow: "0 0 16px rgba(0,255,255,0.2)",
          }}
        >
          <Scan className="w-4 h-4 text-cyan-400" />
        </div>
        <span className="text-white font-bold tracking-tight text-sm">
          Attendly <span className="text-cyan-400">AI</span>
        </span>
      </button>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-1">
        {links.map((l) => (
          <button
            key={l}
            onClick={() => setPage(l)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              page === l ? "text-cyan-400" : "text-slate-400 hover:text-white"
            }`}
            style={
              page === l
                ? { background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.2)" }
                : {}
            }
          >
            {l}
          </button>
        ))}
      </div>

      {/* Desktop CTA */}
      <div className="hidden md:flex items-center gap-3">
        <button className="text-sm text-slate-400 hover:text-white transition-colors">
          Sign In
        </button>
        <button
          className="flex items-center gap-1 px-4 py-1.5 rounded-lg text-sm font-bold text-black transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:scale-105"
          style={{ background: "linear-gradient(135deg, #00ffff, #00c8ff)" }}
        >
          Get Started <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden text-slate-400 hover:text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-2 p-3 rounded-2xl flex flex-col gap-1"
          style={{
            background: "rgba(7,7,26,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {links.map((l) => (
            <button
              key={l}
              onClick={() => { setPage(l); setOpen(false); }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all ${
                page === l
                  ? "text-cyan-400 bg-cyan-400/10"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {l}
            </button>
          ))}
          <div className="border-t border-white/5 mt-2 pt-2">
            <button
              className="w-full py-2.5 rounded-xl text-sm font-bold text-black"
              style={{ background: "linear-gradient(135deg, #00ffff, #8b5cf6)" }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ setPage }) {
  return (
    <footer
      className="relative z-10 border-t py-8 px-6"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <button className="flex items-center gap-2" onClick={() => setPage("Home")}>
          <Scan className="w-4 h-4 text-cyan-400" />
          <span className="text-white text-sm font-bold">
            Attendly <span className="text-cyan-400">AI</span>
          </span>
        </button>
        <p className="text-slate-600 text-xs">© 2025 Attendly AI. All rights reserved.</p>
        <div className="flex gap-4 text-xs text-slate-600">
          {["Privacy", "Terms", "Security"].map((l) => (
            <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────────────────────
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
      {/* Outer ping ring */}
      <div
        className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <div className="absolute inset-4 rounded-full border border-cyan-400/10" />

      {/* Face frame */}
      <div
        className="absolute inset-8 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(0,255,255,0.04), rgba(139,92,246,0.04))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,255,255,0.15)",
          boxShadow: "0 0 40px rgba(0,255,255,0.08), inset 0 0 40px rgba(0,255,255,0.03)",
        }}
      >
        {/* Corner brackets */}
        {[
          "top-2 left-2",
          "top-2 right-2 rotate-90",
          "bottom-2 right-2 rotate-180",
          "bottom-2 left-2 -rotate-90",
        ].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5`}>
            <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-cyan-400" />
          </div>
        ))}

        {/* Animated scan line */}
        <div
          className="absolute left-0 right-0 h-[2px]"
          style={{
            top: `${scanPos}%`,
            background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.8), transparent)",
            boxShadow: "0 0 12px rgba(0,255,255,0.6)",
          }}
        />

        {/* Biometric dots */}
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

        {/* Centre scan icon */}
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

function HomePage() {
  const featureCards = [
    { icon: Brain,    title: "Gemini Anomaly Detection", desc: "AI flags ghost attendance, proxy attempts, and unusual patterns in real time using Gemini's multimodal reasoning.", accent: "#8b5cf6" },
    { icon: Scan,     title: "Face-API.js Biometrics",   desc: "Browser-native facial landmark detection with liveness checks to prevent spoofing.",                               accent: "#00ffff" },
    { icon: Shield,   title: "Zero-Trust Security",      desc: "End-to-end AES-256 encryption. Face embeddings never leave your infrastructure.",                                  accent: "#8b5cf6" },
    { icon: BarChart3,title: "Live Analytics",           desc: "Real-time attendance heatmaps, trend graphs, and exportable reports with one click.",                              accent: "#00ffff" },
    { icon: Cpu,      title: "Edge-Ready Architecture",  desc: "Runs on commodity hardware — no GPU required. Powered by WebAssembly.",                                           accent: "#8b5cf6" },
    { icon: Wifi,     title: "Offline-First Mode",       desc: "Scans cache locally and sync when connection resumes. Works anywhere.",                                            accent: "#00ffff" },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          {/* Left copy */}
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
              Attendly AI replaces manual roll calls with instant facial biometrics — 98.7% accurate,
              real-time anomaly alerts, and zero friction.
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
                <Eye className="w-4 h-4" /> Watch Demo
              </button>
            </div>
          </div>

          {/* Right visual */}
          <div className="flex-1 flex justify-center">
            <ScanVisual />
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "98.7%", label: "Recognition Accuracy", icon: Activity },
            { value: "<0.3s", label: "Scan Speed",            icon: Zap      },
            { value: "50K+",  label: "Daily Scans",           icon: Users    },
            { value: "99.9%", label: "Uptime SLA",            icon: Clock    },
          ].map((s, i) => (
            <div
              key={i}
              className="px-6 py-5 rounded-2xl hover:-translate-y-1 transition-all duration-300 cursor-default"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.15)" }}
                >
                  <s.icon className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white font-mono">{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature grid ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Intelligence at Every Layer
            </h2>
            <p className="text-slate-400">Built for scale. Designed for precision.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featureCards.map((f, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-default"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(ellipse at top left, ${f.accent}10 0%, transparent 70%)`,
                  }}
                />
                <div
                  className="inline-flex p-3 rounded-xl mb-4"
                  style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}30` }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.accent }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-3xl p-10 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,255,255,0.06), rgba(139,92,246,0.08))",
              border: "1px solid rgba(0,255,255,0.15)",
              backdropFilter: "blur(24px)",
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">Ready to go passwordless?</h2>
            <p className="text-slate-400 mb-8">
              Join 200+ institutions using Attendly AI. Setup takes under 10 minutes.
            </p>
            <button
              className="px-8 py-3.5 rounded-xl font-bold text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(0,255,255,0.4)] transition-all duration-300"
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

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function AboutPage() {
  const timeline = [
    { phase: "STEP 01", icon: Monitor,      title: "Camera Capture",                  desc: "The system silently activates the device camera on session start. No action required from the student.",                                      accent: "#00ffff" },
    { phase: "STEP 02", icon: Scan,         title: "Face Detection & Landmark Mapping",desc: "face-api.js detects 68 facial landmarks and generates a 128-dimension face embedding in the browser.",                                        accent: "#8b5cf6" },
    { phase: "STEP 03", icon: Shield,       title: "Liveness Check",                  desc: "Anti-spoofing module validates eye-blink cadence and depth cues to reject photos and video replays.",                                          accent: "#00ffff" },
    { phase: "STEP 04", icon: Database,     title: "Vector Matching",                 desc: "Embedding is compared against MongoDB Atlas Vector Search index. Match threshold: 0.82 cosine similarity.",                                    accent: "#8b5cf6" },
    { phase: "STEP 05", icon: Brain,        title: "Gemini Anomaly Analysis",         desc: "Gemini reviews contextual signals — time, location, device, patterns — to flag suspicious events.",                                           accent: "#00ffff" },
    { phase: "STEP 06", icon: CheckCircle2, title: "Record & Notify",                 desc: "Attendance logged to MongoDB, dashboard updates live, anomalies trigger instant Slack/email alerts.",                                          accent: "#8b5cf6" },
  ];

  const archNodes = [
    { icon: Monitor,      label: "React + Vite",   sub: "face-api.js",    accent: "#00ffff" },
    { icon: Server,       label: "Express.js",     sub: "REST / WS",      accent: "#8b5cf6" },
    { icon: Brain,        label: "Gemini 1.5",     sub: "Anomaly AI",     accent: "#00ffff" },
    { icon: Database,     label: "MongoDB Atlas",  sub: "Vector Search",  accent: "#8b5cf6" },
    { icon: Shield,       label: "Liveness Engine",sub: "Anti-Spoof",     accent: "#00ffff" },
    { icon: Layers,       label: "Node.js",        sub: "Runtime",        accent: "#8b5cf6" },
    { icon: Users,        label: "Auth Service",   sub: "JWT + RBAC",     accent: "#00ffff" },
    { icon: Clock,        label: "Cron Jobs",      sub: "Reports",        accent: "#8b5cf6" },
  ];

  return (
    <div className="relative min-h-screen text-white">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-violet-300 mb-6"
            style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)" }}
          >
            OUR STORY
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            From{" "}
            <span className="line-through text-slate-600">Roll Calls</span>
            <br />
            to{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00ffff, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI Biometrics.
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Attendly AI was born from a simple frustration — attendance should never be a bottleneck.
            We rebuilt the process from scratch using modern computer vision and large language model intelligence.
          </p>
        </div>
      </section>

      {/* ── Problem vs Solution ─────────────────────────────────────────────── */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <h2 className="text-2xl font-bold text-white">The Problem We Solved</h2>
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Legacy */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.12)", backdropFilter: "blur(16px)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-semibold text-sm">LEGACY APPROACH</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Manual roll calls waste 8–12 min/session",
                  "Proxy attendance undetectable",
                  "Paper registers lost or damaged",
                  "No real-time anomaly visibility",
                  "Reporting delays by days or weeks",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Attendly AI */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: "rgba(0,255,255,0.02)", border: "1px solid rgba(0,255,255,0.12)", backdropFilter: "blur(16px)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-semibold text-sm">ATTENDLY AI</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Sub-300ms facial verification",
                  "Liveness detection stops all spoofing",
                  "Blockchain-anchored audit trail",
                  "Gemini flags anomalies in real time",
                  "Instant PDF/CSV dashboards",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
          <p className="text-slate-400 mb-10">
            A student's journey through Attendly AI in under a second.
          </p>
          <div>
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-6 group">
                {/* Icon + connector line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${step.accent}20`,
                      border: `1px solid ${step.accent}50`,
                      boxShadow: `0 0 20px ${step.accent}20`,
                    }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: step.accent }} />
                  </div>
                  {i < timeline.length - 1 && (
                    <div
                      className="w-[1px] h-full mt-3"
                      style={{ background: `${step.accent}25` }}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="pb-10">
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded mb-2 inline-block"
                    style={{ background: `${step.accent}15`, color: step.accent }}
                  >
                    {step.phase}
                  </span>
                  <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Technical Architecture</h2>
            <p className="text-slate-400">MERN stack with AI inference at the edge and cloud.</p>
          </div>

          <div
            className="rounded-3xl p-8 mb-8"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {archNodes.map((node, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:-translate-y-1 transition-transform duration-200 cursor-default"
                  style={{ background: `${node.accent}08`, border: `1px solid ${node.accent}20` }}
                >
                  <node.icon className="w-6 h-6" style={{ color: node.accent }} />
                  <div className="text-center">
                    <div className="text-white text-xs font-semibold">{node.label}</div>
                    <div className="text-slate-500 text-[10px]">{node.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "MongoDB", "Express.js", "React 18", "Node.js",
              "face-api.js", "Gemini 1.5 Pro", "TailwindCSS",
              "JWT Auth", "Atlas Vector Search", "WebSockets",
            ].map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-mono text-slate-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE — reusable sub-components
// ─────────────────────────────────────────────────────────────────────────────
function GlowInput({ label, icon: Icon, type = "text", placeholder, id, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
          style={{ color: focused ? "#00ffff" : "#64748b" }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-10 pr-4 py-3.5 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-300"
          style={{
            background: focused ? "rgba(0,255,255,0.04)" : "rgba(255,255,255,0.02)",
            border: focused
              ? "1px solid rgba(0,255,255,0.4)"
              : "1px solid rgba(255,255,255,0.07)",
            boxShadow: focused ? "0 0 20px rgba(0,255,255,0.1)" : "none",
            backdropFilter: "blur(8px)",
          }}
        />
      </div>
    </div>
  );
}

function GlowTextarea({ label, placeholder, id, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wider"
      >
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={5}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder-slate-600 outline-none transition-all duration-300 resize-none"
        style={{
          background: focused ? "rgba(0,255,255,0.04)" : "rgba(255,255,255,0.02)",
          border: focused
            ? "1px solid rgba(0,255,255,0.4)"
            : "1px solid rgba(255,255,255,0.07)",
          boxShadow: focused ? "0 0 20px rgba(0,255,255,0.1)" : "none",
          backdropFilter: "blur(8px)",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", org: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  return (
    <div className="relative min-h-screen text-white">

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 mb-6"
            style={{ background: "rgba(0,255,255,0.08)", border: "1px solid rgba(0,255,255,0.2)" }}
          >
            <Zap className="w-3 h-3" />
            RESPONSE TIME &lt; 2 HOURS
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            Get in{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00ffff, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Touch
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Questions, demos, or enterprise pricing — we're one message away.
          </p>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">

          {/* Form (3 cols) */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div
                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 rounded-2xl"
                style={{
                  background: "rgba(0,255,255,0.02)",
                  border: "1px solid rgba(0,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(0,255,255,0.1)", boxShadow: "0 0 40px rgba(0,255,255,0.2)" }}
                >
                  <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Received!</h3>
                <p className="text-slate-400 mb-6">
                  Our team (and our AI) will get back to you within 2 hours.
                </p>
                <button
                  className="px-6 py-2.5 rounded-xl text-sm text-white hover:bg-white/10 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", org: "", subject: "", message: "" });
                  }}
                >
                  Send Another →
                </button>
              </div>
            ) : (
              <div
                className="relative p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <GlowInput label="Full Name"   icon={User} id="name"  placeholder="Jane Smith"   value={form.name}  onChange={update("name")}  required />
                    <GlowInput label="Work Email"  icon={Mail} id="email" placeholder="jane@org.edu" value={form.email} onChange={update("email")} required type="email" />
                  </div>
                  <GlowInput label="Organization" icon={Building2}    id="org"     placeholder="MIT, Stanford, Corp..."                value={form.org}     onChange={update("org")}     />
                  <GlowInput label="Subject"      icon={MessageSquare} id="subject" placeholder="Demo Request / Pricing / Technical..." value={form.subject} onChange={update("subject")} required />
                  <GlowTextarea label="Message"   id="message" placeholder="Tell us about your use case and scale..." value={form.message} onChange={update("message")} />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] disabled:opacity-70 disabled:scale-100"
                    style={{ background: "linear-gradient(135deg, #00ffff, #8b5cf6)" }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar (2 cols) */}
          <div className="lg:col-span-2 space-y-5">

            {/* AI Support widget */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(139,92,246,0.05)",
                border: "1px solid rgba(139,92,246,0.2)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  <Bot className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">Attendly Support AI</div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-xs">Online · Avg reply &lt;2 min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  "👋 Hi! I'm here to help with setup, demos, or billing.",
                  "I can also schedule a live call with our engineering team.",
                ].map((msg, i) => (
                  <div
                    key={i}
                    className="px-3.5 py-2.5 rounded-xl rounded-tl-none text-sm text-slate-300 max-w-[85%]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {msg}
                  </div>
                ))}
                {aiTyping && (
                  <div
                    className="px-3.5 py-3 rounded-xl rounded-tl-none inline-flex gap-1 items-center"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                className="mt-4 w-full py-2.5 rounded-xl text-sm text-violet-300 font-medium hover:text-white transition-all"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}
                onClick={() => { setAiTyping(true); setTimeout(() => setAiTyping(false), 2500); }}
              >
                Chat with Support AI →
              </button>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: Mail,   label: "Email", value: "hello@attendly.ai",  accent: "#00ffff" },
                { icon: Phone,  label: "Phone", value: "+1 (800) ATTEND-AI", accent: "#8b5cf6" },
                { icon: MapPin, label: "HQ",    value: "San Francisco, CA",  accent: "#00ffff" },
              ].map((info, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${info.accent}15`, border: `1px solid ${info.accent}30` }}
                  >
                    <info.icon className="w-4 h-4" style={{ color: info.accent }} />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">{info.label}</div>
                    <div className="text-white text-sm font-medium">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links — inline SVG (no deprecated lucide brand icons) */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              <p className="text-slate-500 text-xs font-mono mb-3 uppercase tracking-wider">
                Follow Us
              </p>
              <div className="flex gap-3">
                {socialLinks.map(({ label, accent, svg }) => (
                  <button
                    key={label}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:scale-110 transition-all duration-200"
                    style={{ background: `${accent}10`, border: `1px solid ${accent}25`, color: accent }}
                  >
                    {svg}
                  </button>
                ))}
              </div>
            </div>

            {/* SLA badge */}
            <div
              className="p-4 rounded-2xl text-center"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,255,0.04), rgba(139,92,246,0.04))",
                border: "1px solid rgba(0,255,255,0.1)",
              }}
            >
              <div className="text-2xl font-black font-mono text-white mb-0.5">&lt; 2 hrs</div>
              <div className="text-slate-400 text-xs">
                Average first response — guaranteed on Business &amp; Enterprise plans.
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("Home");

  const renderPage = () => {
    switch (page) {
      case "Home":    return <HomePage />;
      case "About":   return <AboutPage />;
      case "Contact": return <ContactPage />;
      default:        return <HomePage />;
    }
  };

  return (
    <div className="bg-[#07071a] min-h-screen font-sans">
      <GridBackground />
      <Navbar page={page} setPage={setPage} />
      <main>{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}
