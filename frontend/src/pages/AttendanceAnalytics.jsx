import { useEffect, useState } from "react";
import { Zap, Calendar, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { attendanceAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function AttendanceCalculator({ present, total }) {
  const [target, setTarget] = useState(75);
  const calculate = () => {
    if (!total || total === 0) return { type: "neutral", value: 0 };
    const current = (present / total) * 100;
    if (current >= target) {
      const canMiss = Math.floor((100 * present - target * total) / target);
      return { type: "success", value: Math.max(0, canMiss), label: "Classes you can safely miss" };
    } else {
      const toAttend = Math.ceil((target * total - 100 * present) / (100 - target));
      return { type: "warning", value: Math.max(0, toAttend), label: "Required consecutive classes" };
    }
  };
  const result = calculate();
  return (
    <div className="glass-card p-6 h-full flex flex-col shadow-lg border border-surfaceLight/20">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-primary" fill="currentColor" />
        <h3 className="text-lg font-bold text-white tracking-tight">AI Attendance Estimator</h3>
      </div>
      <div className="space-y-6 flex-1">
        <div>
          <div className="flex justify-between text-xs mb-3">
            <span className="text-gray-400 font-medium">Target Requirement</span>
            <span className="text-primary font-bold">{target}%</span>
          </div>
          <input
            type="range"
            min="75"
            max="95"
            step="1"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value))}
            className="w-full h-1.5 bg-surfaceLight rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className={`p-6 rounded-xl border transition-all duration-300 ${result.type === "success" ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">{result.label}</p>
          <div className="flex items-end gap-2.5">
            <span className={`text-4xl font-playfair font-bold leading-none ${result.type === "success" ? "text-emerald-400" : "text-amber-400"}`}>{result.value}</span>
            <span className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-tighter">Sessions</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-600 mt-6 italic bg-surfaceLight/10 p-3 rounded-lg border border-surfaceLight/5">
        * Estimates based on your current total of {total} verified sessions.
      </p>
    </div>
  );
}

function CalendarView({ calendarData }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const getStatus = (day) => {
    if (!day) return null;
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calendarData?.[key] || null;
  };

  return (
    <div className="glass-card p-6 shadow-lg border border-surfaceLight/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          <h3 className="text-lg font-bold text-white tracking-tight">Monthly Tracker</h3>
        </div>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">{MONTHS[month]} {year}</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-[10px] font-bold text-gray-600 uppercase pb-2 tracking-wide">{d[0]}</div>
        ))}
        {days.map((day, i) => {
          const status = getStatus(day);
          const isToday = day === today.getDate();
          return (
            <div key={i} className={`aspect-square sm:aspect-auto sm:py-2.5 text-xs font-bold rounded-lg transition-colors border ${!day ? "border-transparent" : isToday ? "border-primary bg-primary/5 text-primary" : status === "present" ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-400" : status === "absent" ? "bg-red-500/10 border-red-500/10 text-red-400" : "border-surfaceLight/20 text-gray-600 hover:border-gray-500"}`}>
              {day || ""}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-6 pt-5 border-t border-surfaceLight/10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500/40" />
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-red-500/30 border border-red-500/40" />
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">Absent</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] uppercase font-bold text-primary tracking-tighter decoration-primary underline-offset-4 underline">Today</span>
        </div>
      </div>
    </div>
  );
}

export const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attendanceAPI.getStudentAttendance()
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load analytics data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/my-attendance')} className="p-2.5 bg-surfaceLight rounded-xl hover:bg-primary/20 hover:text-primary transition-all group border border-white/5 active:scale-95">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-playfair font-bold text-white tracking-tight">
            Planning & Insights
          </motion.h2>
          <p className="text-xs text-gray-500 mt-0.5 font-medium uppercase tracking-widest">Predictive Analytics Hub</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          {loading ? (
             <div className="glass-card p-10 flex flex-col items-center justify-center space-y-4 rounded-2xl">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Crunching Stats...</p>
             </div>
          ) : (
            <AttendanceCalculator
              present={data?.subjects?.reduce((acc, sub) => acc + sub.present, 0) || 0}
              total={data?.subjects?.reduce((acc, sub) => acc + sub.total, 0) || 0}
            />
          )}
        </div>
        <div className="lg:col-span-3">
          {loading ? (
             <div className="glass-card p-10 h-full flex items-center justify-center rounded-2xl text-gray-600">
                <div className="w-full h-64 bg-surfaceLight/20 animate-pulse rounded-xl" />
             </div>
          ) : (
            <CalendarView calendarData={data?.calendar} />
          )}
        </div>
      </div>

      <div className="mt-10 glass-card p-6 border border-primary/10 bg-gradient-to-br from-primary/5 via-transparent to-transparent flex items-start gap-5 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary shadow-lg border border-primary/20 mt-1">
            <Zap size={20} fill="currentColor" />
        </div>
        <div>
            <h4 className="text-white font-bold text-lg mb-1 tracking-tight">Smart Prediction Engine</h4>
            <p className="text-xs text-gray-500 max-w-3xl leading-relaxed">
              Our AI models analyze your biometric check-ins and subject history to help you maintain target attendance. 
              The estimator calculates consecutive required classes based on your goal threshold, while the calendar provides a snapshot of your monthly consistency metrics.
            </p>
        </div>
      </div>
    </div>
  );
};
