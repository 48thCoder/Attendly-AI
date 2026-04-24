import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { attendanceAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { SubjectChart } from "../components/Charts/SubjectChart";
import { SkeletonCard } from "../components/LoadingSpinner";
import { getAttendanceColor } from "../utils/helpers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    attendanceAPI
      .getStudentAttendance()
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load your attendance"))
      .finally(() => setLoading(false));
  }, []);

  const pct = data?.overallPct ?? 0;
  const isWarning = pct < 75;
  const attColor = getAttendanceColor(pct);

  return (
    <div className="page-container relative">
      <div className="mb-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-playfair font-bold text-white"
        >
          My Dashboard
        </motion.h2>
        <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-2">
          <span>
            {user?.name} · {user?.roll}
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="text-primary font-mono font-medium tracking-wider">
            {currentTime.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </span>
        </p>
      </div>

      {!loading && isWarning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm mb-4"
        >
          <AlertTriangle
            size={18}
            className="text-amber-400 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="text-amber-400 font-semibold">Attendance Warning</p>
            <p className="text-gray-400 mt-0.5 leading-relaxed">
              Your overall attendance is{" "}
              <strong className="text-amber-400">{pct}%</strong>. You must maintain at least <strong>75%</strong> to avoid automatic exclusion.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-4 border-l-4 border-orange-500 shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex flex-shrink-0 items-center justify-center border border-orange-500/10">
            <span className="text-xl">🔥</span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Current Streak</p>
            <p className="text-lg font-bold text-white uppercase tracking-tight">5 Days</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5 flex items-center gap-4 border-l-4 border-emerald-500 shadow-xl"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex flex-shrink-0 items-center justify-center text-emerald-400 border border-emerald-500/10">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Badges Earned</p>
            <div className="flex gap-1.5 mt-1">
              <span className="w-6 h-6 rounded-lg bg-yellow-400/20 border border-yellow-400/40 text-[10px] flex items-center justify-center" title="Early Bird">🐦</span>
              <span className="w-6 h-6 rounded-lg bg-purple-400/20 border border-purple-400/40 text-[10px] flex items-center justify-center" title="Perfect Month">🌟</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 flex items-center gap-4 border-l-4 border-primary shadow-xl md:col-span-2 lg:col-span-1"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex flex-shrink-0 items-center justify-center text-primary border border-primary/10">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Bio-Metric</p>
            <p className="text-lg font-bold text-white uppercase tracking-tighter">AI-OPTIMIZED ✓</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
          {loading ? (
            <SkeletonCard />
          ) : (
            <>
              <div className="relative w-40 h-40 mb-6 font-playfair font-bold">
                <svg
                  className="w-full h-full -rotate-90 drop-shadow-xl"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="#1e293b"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke={
                      pct >= 85 ? "#34d399" : pct >= 75 ? "#fbbf24" : "#f87171"
                    }
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - pct / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className={`text-4xl font-playfair font-bold drop-shadow-lg ${attColor}`}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-2">
                Overall Attendance
              </h3>
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest bg-surfaceLight/30 px-3 py-1 rounded-full border border-white/5">
                {pct >= 85 ? "Good standing" : pct >= 75 ? "Warning" : "Exclusion Limit"}
              </p>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 glass-card p-6 shadow-xl"
        >
          <div className="flex items-center gap-2.5 mb-6">
            <BookOpen size={20} className="text-primary opacity-80" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Subject Breakdown
            </h3>
          </div>
          {loading ? (
            <div className="skeleton h-56 rounded-2xl" />
          ) : (
            <>
              <SubjectChart data={data?.subjects ?? []} />
              <div className="mt-6 space-y-3.5">
                {data?.subjects.map((sub) => (
                  <div key={sub.name} className="flex items-center gap-5">
                    <span className="text-xs text-gray-400 w-36 truncate flex-shrink-0">
                      {sub.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.percentage}%` }}
                        transition={{
                          duration: 1,
                          ease: "easeOut",
                          delay: 0.4,
                        }}
                        className={`h-full rounded-full ${sub.percentage >= 85 ? "bg-emerald-400" : sub.percentage >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                      />
                    </div>
                    <div className="w-24 flex items-center justify-between gap-3 text-right">
                         <span className={`text-xs font-semibold ${sub.percentage >= 85 ? "text-emerald-400" : sub.percentage >= 75 ? "text-amber-400" : "text-red-400"}`}>
                            {sub.percentage}%
                        </span>
                        <span className="text-[10px] font-mono text-gray-500">
                            {sub.present}/{sub.total}
                        </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-8 p-6 glass-card border-t-2 border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                <Zap size={24} fill="currentColor" />
            </div>
            <div>
                <h4 className="text-white font-bold text-lg tracking-tight">AI Planning Hub</h4>
                <p className="text-xs text-gray-500 font-medium">Predictive analytics and track trends</p>
            </div>
        </div>
        <button 
           onClick={() => navigate('/analytics')}
           className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all text-sm font-bold tracking-wider"
        >
            Enter Analytics Center
        </button>
      </motion.div>
    </div>
  );
};
