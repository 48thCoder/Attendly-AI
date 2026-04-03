import {
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers,
  Server,
  Monitor,
  Brain,
  Scan,
  Shield,
  Clock,
  Users,
} from "lucide-react";

function TimelineStep({ phase, title, desc, active, icon: Icon, accent }) {
  return (
    <div className={`relative flex gap-6 group ${active ? "" : "opacity-60"}`}>
      {/* Line */}
      <div className="flex flex-col items-center">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{
            background: active ? `${accent}20` : "rgba(255,255,255,0.03)",
            border: `1px solid ${active ? accent + "50" : "rgba(255,255,255,0.08)"}`,
            boxShadow: active ? `0 0 20px ${accent}20` : "none",
          }}
        >
          <Icon className="w-5 h-5" style={{ color: active ? accent : "#64748b" }} />
        </div>
        <div className="w-[1px] h-full mt-3" style={{ background: active ? `${accent}30` : "rgba(255,255,255,0.06)" }} />
      </div>

      {/* Content */}
      <div className="pb-10">
        <span
          className="text-xs font-mono px-2 py-0.5 rounded mb-2 inline-block"
          style={{ background: `${accent}15`, color: accent }}
        >
          {phase}
        </span>
        <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  );
}

function ArchNode({ icon: Icon, label, sub, accent, top, left, right, bottom }) {
  const pos = {};
  if (top !== undefined) pos.top = top;
  if (left !== undefined) pos.left = left;
  if (right !== undefined) pos.right = right;
  if (bottom !== undefined) pos.bottom = bottom;

  return (
    <div className="absolute flex flex-col items-center gap-2 group" style={{ ...pos, transform: "translate(-50%, -50%)" }}>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 20px ${accent}15`,
          backdropFilter: "blur(12px)",
        }}
      >
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>
      <div className="text-center">
        <div className="text-white text-xs font-semibold whitespace-nowrap">{label}</div>
        {sub && <div className="text-slate-500 text-[10px] whitespace-nowrap">{sub}</div>}
      </div>
    </div>
  );
}

function ProblemVsSolution() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {/* Problem */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(239,68,68,0.03)",
          border: "1px solid rgba(239,68,68,0.12)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-semibold text-sm">LEGACY APPROACH</span>
        </div>
        <ul className="space-y-3">
          {[
            "Manual roll calls waste 8-12 min/session",
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

      {/* Solution */}
      <div
        className="p-6 rounded-2xl"
        style={{
          background: "rgba(0,255,255,0.02)",
          border: "1px solid rgba(0,255,255,0.12)",
          backdropFilter: "blur(16px)",
        }}
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
  );
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen text-white">
      {/* Hero */}
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
            Attendly AI was born from a simple frustration—attendance should never be a bottleneck. We rebuilt the process from scratch using modern computer vision and large language model intelligence.
          </p>
        </div>
      </section>

      {/* Problem vs Solution */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <h2 className="text-2xl font-bold text-white">The Problem We Solved</h2>
            <ArrowRight className="w-5 h-5 text-cyan-400" />
          </div>
          <ProblemVsSolution />
        </div>
      </section>

      {/* Timeline */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-2">How It Works</h2>
            <p className="text-slate-400">A student's journey through Attendly AI in under a second.</p>
          </div>

          <div>
            {[
              { phase: "STEP 01", icon: Monitor, title: "Camera Capture", desc: "The system silently activates the device camera on session start. No action required from the student.", active: true, accent: "#00ffff" },
              { phase: "STEP 02", icon: Scan, title: "Face Detection & Landmark Mapping", desc: "face-api.js detects 68 facial landmarks and generates a 128-dimension face embedding in the browser.", active: true, accent: "#8b5cf6" },
              { phase: "STEP 03", icon: Shield, title: "Liveness Check", desc: "Anti-spoofing module validates eye-blink cadence and depth cues to reject photos and video replays.", active: true, accent: "#00ffff" },
              { phase: "STEP 04", icon: Database, title: "Vector Matching", desc: "Embedding is compared against MongoDB Atlas Vector Search index. Match threshold is 0.82 cosine similarity.", active: true, accent: "#8b5cf6" },
              { phase: "STEP 05", icon: Brain, title: "Gemini Anomaly Analysis", desc: "Gemini reviews contextual signals—time, location, device, historical patterns—to flag suspicious events.", active: true, accent: "#00ffff" },
              { phase: "STEP 06", icon: CheckCircle2, title: "Record & Notify", desc: "Attendance logged to MongoDB, instructor dashboard updates live, anomalies trigger instant Slack/email alert.", active: true, accent: "#8b5cf6" },
            ].map((step, i) => (
              <TimelineStep key={i} {...step} />
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Technical Architecture</h2>
            <p className="text-slate-400">MERN stack with AI inference at the edge and cloud.</p>
          </div>

          {/* Architecture Diagram */}
          <div
            className="relative rounded-3xl p-8 mb-8 overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.015)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(16px)",
              minHeight: "340px",
            }}
          >
            {/* Layer labels */}
            <div className="absolute left-6 top-0 bottom-0 flex flex-col justify-around py-8">
              {["FRONTEND", "API LAYER", "AI LAYER", "DATA LAYER"].map((l, i) => (
                <span key={i} className="text-[10px] font-mono text-slate-600 writing-mode-vertical" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  {l}
                </span>
              ))}
            </div>

            {/* Nodes grid */}
            <div className="ml-10 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Monitor, label: "React + Vite", sub: "face-api.js", accent: "#00ffff" },
                { icon: Server, label: "Express.js", sub: "REST / WS", accent: "#8b5cf6" },
                { icon: Brain, label: "Gemini 1.5", sub: "Anomaly AI", accent: "#00ffff" },
                { icon: Database, label: "MongoDB Atlas", sub: "Vector Search", accent: "#8b5cf6" },
                { icon: Shield, label: "Liveness Engine", sub: "Anti-Spoof", accent: "#00ffff" },
                { icon: Layers, label: "Node.js", sub: "Runtime", accent: "#8b5cf6" },
                { icon: Users, label: "Auth Service", sub: "JWT + RBAC", accent: "#00ffff" },
                { icon: Clock, label: "Cron Jobs", sub: "Reports", accent: "#8b5cf6" },
              ].map((node, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl group hover:-translate-y-1 transition-transform duration-200 cursor-default"
                  style={{
                    background: `${node.accent}08`,
                    border: `1px solid ${node.accent}20`,
                  }}
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
            {["MongoDB", "Express.js", "React 18", "Node.js", "face-api.js", "Gemini 1.5 Pro", "TailwindCSS", "JWT Auth", "Atlas Vector Search", "WebSockets"].map((t, i) => (
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

