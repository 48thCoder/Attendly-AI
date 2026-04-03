import { useState } from "react";
import {
  Mail,
  MessageSquare,
  User,
  Building2,
  Send,
  Bot,
  CheckCircle2,
  Phone,
  MapPin,
  Zap,
} from "lucide-react";

// ─── SOCIAL ICONS (inline SVG — lucide-react deprecated brand logos) ──────────
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

// ─── GLOW INPUT ───────────────────────────────────────────────────────────────
function GlowInput({ label, icon: Icon, type = "text", placeholder, id, value, onChange, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
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

// ─── GLOW TEXTAREA ────────────────────────────────────────────────────────────
function GlowTextarea({ label, placeholder, id, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
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

// ─── AI SUPPORT WIDGET ────────────────────────────────────────────────────────
function AISupportIndicator() {
  const [typing, setTyping] = useState(false);

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        background: "rgba(139,92,246,0.05)",
        border: "1px solid rgba(139,92,246,0.2)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(139,92,246,0.15)",
            border: "1px solid rgba(139,92,246,0.3)",
          }}
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

      {/* Chat bubbles */}
      <div className="space-y-2.5">
        <div
          className="px-3.5 py-2.5 rounded-xl rounded-tl-none text-sm text-slate-300 max-w-[85%]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          👋 Hi! I'm here to help with setup, demos, or billing.
        </div>
        <div
          className="px-3.5 py-2.5 rounded-xl rounded-tl-none text-sm text-slate-300 max-w-[85%]"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          I can also schedule a live call with our engineering team.
        </div>

        {/* Typing indicator */}
        {typing && (
          <div
            className="px-3.5 py-3 rounded-xl rounded-tl-none inline-flex gap-1 items-center"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
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
        className="mt-4 w-full py-2.5 rounded-xl text-sm text-violet-300 font-medium transition-all duration-200 hover:text-white"
        style={{
          background: "rgba(139,92,246,0.1)",
          border: "1px solid rgba(139,92,246,0.25)",
        }}
        onClick={() => {
          setTyping(true);
          setTimeout(() => setTyping(false), 2500);
        }}
      >
        Chat with Support AI →
      </button>
    </div>
  );
}

// ─── INFO CARD ────────────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: `${accent}15`,
          border: `1px solid ${accent}30`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div>
        <div className="text-slate-500 text-xs mb-0.5">{label}</div>
        <div className="text-white text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

// ─── MAIN CONTACT PAGE ────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1800);
  };

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="relative min-h-screen text-white">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-300 mb-6"
            style={{
              background: "rgba(0,255,255,0.08)",
              border: "1px solid rgba(0,255,255,0.2)",
            }}
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
            Questions, demos, or enterprise pricing—we're one message away.
          </p>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-8">

          {/* ── Form (3 cols) ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {submitted ? (
              /* Success state */
              <div
                className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl"
                style={{
                  background: "rgba(0,255,255,0.02)",
                  border: "1px solid rgba(0,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    background: "rgba(0,255,255,0.1)",
                    boxShadow: "0 0 40px rgba(0,255,255,0.2)",
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Received!</h3>
                <p className="text-slate-400 mb-6">
                  Our team (and our AI) will get back to you within 2 hours.
                </p>
                <button
                  className="px-6 py-2.5 rounded-xl text-sm text-white transition-all duration-200 hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", org: "", subject: "", message: "" });
                  }}
                >
                  Send Another →
                </button>
              </div>
            ) : (
              /* Form state */
              <div
                className="relative p-7 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.015)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(20px)",
                }}
              >
                {/* Top accent line */}
                <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

                <h2 className="text-lg font-bold text-white mb-6">Send a Message</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <GlowInput
                      label="Full Name"
                      icon={User}
                      id="name"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={update("name")}
                      required
                    />
                    <GlowInput
                      label="Work Email"
                      icon={Mail}
                      type="email"
                      id="email"
                      placeholder="jane@org.edu"
                      value={form.email}
                      onChange={update("email")}
                      required
                    />
                  </div>

                  <GlowInput
                    label="Organization"
                    icon={Building2}
                    id="org"
                    placeholder="MIT, Stanford, Corp..."
                    value={form.org}
                    onChange={update("org")}
                  />

                  <GlowInput
                    label="Subject"
                    icon={MessageSquare}
                    id="subject"
                    placeholder="Demo Request / Pricing / Technical..."
                    value={form.subject}
                    onChange={update("subject")}
                    required
                  />

                  <GlowTextarea
                    label="Message"
                    id="message"
                    placeholder="Tell us about your use case and scale..."
                    value={form.message}
                    onChange={update("message")}
                  />

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

          {/* ── Sidebar (2 cols) ───────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* AI Support widget */}
            <AISupportIndicator />

            {/* Contact info cards */}
            <div className="space-y-3">
              <InfoCard icon={Mail}   label="Email" value="hello@attendly.ai"  accent="#00ffff" />
              <InfoCard icon={Phone}  label="Phone" value="+1 (800) ATTEND-AI" accent="#8b5cf6" />
              <InfoCard icon={MapPin} label="HQ"    value="San Francisco, CA"  accent="#00ffff" />
            </div>

            {/* Social links */}
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      background: `${accent}10`,
                      border: `1px solid ${accent}25`,
                      color: accent,
                    }}
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
              <div className="text-2xl font-black font-mono text-white mb-0.5">
                &lt; 2 hrs
              </div>
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
