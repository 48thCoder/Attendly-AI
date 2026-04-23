import { useEffect, useState } from "react";
import { AlertTriangle, BookOpen, Calendar, Award, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceAPI } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { SubjectChart } from "../components/Charts/SubjectChart";
import { SkeletonCard } from "../components/LoadingSpinner";
import { getAttendanceColor, getAttendanceBg } from "../utils/helpers";
import toast from "react-hot-toast";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function AttendanceCalculator({ present, total }) {
  const [target, setTarget] = useState(75);

  const calculate = () => {
    if (!total || total === 0) return { type: "neutral", value: 0 };
    const current = (present / total) * 100;

    if (current >= target) {
      const canMiss = Math.floor((100 * present - target * total) / target);
      return {
        type: "success",
        value: Math.max(0, canMiss),
        label: "Classes you can safely miss",
      };
    } else {
      const toAttend = Math.ceil(
        (target * total - 100 * present) / (100 - target),
      );
      return {
        type: "warning",
        value: Math.max(0, toAttend),
        label: "Required consecutive classes",
      };
    }
  };

  const result = calculate();

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={18} className="text-primary" />
        <h3 className="text-lg font-semibold text-white">
          Attendance Estimator
        </h3>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Target Goal</span>
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

        <div
          className={`p-4 rounded-xl border transition-colors ${
            result.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-amber-500/10 border-amber-500/20"
          }`}
        >
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
            {result.label}
          </p>
          <div className="flex items-end gap-2">
            <span
              className={`text-3xl font-playfair font-bold ${result.type === "success" ? "text-emerald-400" : "text-amber-400"}`}
            >
              {result.value}
            </span>
            <span className="text-xs text-gray-500 mb-1.5 font-medium">
              Sessions
            </span>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-600 mt-4 italic leading-relaxed">
        * Estimates based on current total of {total} sessions.
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
    <div>
      <p className="text-sm font-medium text-gray-300 mb-3">
        {MONTHS[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-xs text-gray-600 py-1">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          const status = getStatus(day);
          const isToday = day === today.getDate();
          return (
            <div
              key={i}
              className={`text-xs rounded-md py-1.5 transition-colors ${
                !day
                  ? ""
                  : isToday
                    ? "ring-1 ring-primary text-primary font-bold"
                    : status === "present"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : status === "absent"
                        ? "bg-red-500/20 text-red-400"
                        : "text-gray-600"
              }`}
            >
              {day || ""}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-emerald-500/40 inline-block" />{" "}
          Present
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-red-500/40 inline-block" />{" "}
          Absent
        </span>
      </div>
    </div>
  );
}

export const StudentDashboard = () => {
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
      <div className="mb-2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-playfair font-bold text-white"
        >
          My Dashboard
        </motion.h2>
        <p className="text-sm text-gray-400 mt-1 flex flex-wrap items-center gap-2">
          <span>
            Welcome back, <span className="text-primary">{user?.name}</span> ·{" "}
            {user?.roll}
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
            <p className="text-gray-400 mt-0.5">
              Your overall attendance is{" "}
              <strong className="text-amber-400">{pct}%</strong>, which is below
              the required 75%.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 flex items-center gap-3 border-l-4 border-orange-500"
        >
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex flex-shrink-0 items-center justify-center">
            <span className="text-xl">🔥</span>
          </div>
          <div>
            <p className="text-xs text-gray-400">Current Streak</p>
            <p className="text-lg font-bold text-orange-400">5 Days</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 flex items-center gap-3 border-l-4 border-emerald-500 cursor-help"
          title="Unlocks Perfect Month Achievement"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex flex-shrink-0 items-center justify-center text-emerald-400">
            <Award size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">Badges Earned</p>
            <div className="flex gap-1 mt-0.5">
              <span
                className="w-5 h-5 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-[10px] flex items-center justify-center"
                title="Early Bird"
              >
                🐦
              </span>
              <span
                className="w-5 h-5 rounded-full bg-purple-400/20 border border-purple-400/40 text-[10px] flex items-center justify-center"
                title="Perfect Month"
              >
                🌟
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
            {loading ? (
              <SkeletonCard />
            ) : (
              <>
                <div className="relative w-32 h-32 mb-4">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#1e293b"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={
                        pct >= 85
                          ? "#34d399"
                          : pct >= 75
                            ? "#fbbf24"
                            : "#f87171"
                      }
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-3xl font-playfair font-bold ${attColor}`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm">
                  Overall Attendance
                </h3>
                <span
                  className={`mt-2 text-[10px] px-2.5 py-0.5 rounded-full border ${pct >= 85 ? "badge-present" : pct >= 75 ? "badge-late" : "badge-absent"}`}
                >
                  {pct >= 85
                    ? "✓ Good Standing"
                    : pct >= 75
                      ? "⚠ Average"
                      : "✕ Below Requirement"}
                </span>
                <p className="text-[10px] text-gray-500 mt-3 font-mono">
                  Verified by Attendly AI
                </p>
              </>
            )}
          </div>

          <AttendanceCalculator
            present={
              data?.subjects?.reduce((acc, sub) => acc + sub.attended, 0) || 0
            }
            total={
              data?.subjects?.reduce((acc, sub) => acc + sub.total, 0) || 0
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-primary" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Subject-wise Breakdown
            </h3>
          </div>
          {loading ? (
            <div className="skeleton h-48 rounded-xl" />
          ) : (
            <>
              <SubjectChart data={data?.subjects ?? []} />
              <div className="mt-3 space-y-2">
                {data?.subjects.map((sub) => (
                  <div key={sub.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-36 truncate flex-shrink-0">
                      {sub.name}
                    </span>
                    <div className="flex-1 h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.pct}%` }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          delay: 0.3,
                        }}
                        className={`h-full rounded-full ${sub.pct >= 85 ? "bg-emerald-400" : sub.pct >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                      />
                    </div>
                    <span
                      className={`text-xs font-semibold w-9 text-right ${sub.pct >= 85 ? "text-emerald-400" : sub.pct >= 75 ? "text-amber-400" : "text-red-400"}`}
                    >
                      {sub.pct}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {sub.attended}/{sub.total}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-5 mt-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-primary" />
          <h3 className="text-lg font-semibold text-white">
            Attendance Calendar
          </h3>
        </div>
        {loading ? (
          <div className="skeleton h-52 rounded-xl" />
        ) : (
          <CalendarView calendarData={data?.calendar} />
        )}
      </motion.div>
    </div>
  );
};
