import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, ArrowRight, Cpu, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export const Login = () => {
  const [activeTab, setActiveTab] = useState("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === "teacher" ? "/dashboard" : "/my-attendance");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const demoFill = (role) => {
    setActiveTab(role);
    setEmail(
      role === "teacher" ? "teacher@attendly.ai" : "student@attendly.ai",
    );
    setPassword("demo123");
  };

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 relative overflow-hidden">

      <div className="absolute inset-10 pointer-events-none opacity-20 border-primary/40 animate-bracket">
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#00ffe7 1px, transparent 1px), linear-gradient(90deg, #00ffe7 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ y: 32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="inline-flex items-center gap-3 mb-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
              <Cpu size={22} className="text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-playfair font-extrabold text-gradient mb-2 tracking-wider">
            ATTENDLY AI
          </h1>
          <p className="text-gray-400 text-sm">
            Smart Face Recognition Attendance System
          </p>
        </div>
        <div className="glass-card p-8 shadow-card border-surfaceLight relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="flex bg-background rounded-xl p-1 mb-7 border border-surfaceLight">
            {["teacher", "student"].map((role) => (
              <button
                key={role}
                onClick={() => {
                  setActiveTab(role);
                  setEmail("");
                  setPassword("");
                }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-250 capitalize ${
                  activeTab === role
                    ? "bg-primary text-background shadow-sm font-semibold"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {role === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder={
                    activeTab === "teacher"
                      ? "teacher@attendly.ai"
                      : "student@attendly.ai"
                  }
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-11"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3.5 flex items-center text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-surfaceLight">
            <p className="text-xs text-gray-500 text-center mb-3">
              Try demo credentials
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => demoFill("teacher")}
                className="flex-1 text-xs py-2 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Demo Teacher
              </button>
              <button
                type="button"
                onClick={() => demoFill("student")}
                className="flex-1 text-xs py-2 border border-blue-400/30 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-colors"
              >
                Demo Student
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-5">
          AI-powered attendance • Secure • Real-time
        </p>
      </motion.div>
    </div>
  );
};
