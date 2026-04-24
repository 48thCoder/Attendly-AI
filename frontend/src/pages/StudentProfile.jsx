import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, BookOpen, Award, Zap, ArrowLeft, User, Mail, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { attendanceAPI, studentsAPI } from "../services/api";
import { SubjectChart } from "../components/Charts/SubjectChart";
import { SkeletonCard } from "../components/LoadingSpinner";
import { getAttendanceColor } from "../utils/helpers";
import toast from "react-hot-toast";

export const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentRes, attendanceRes] = await Promise.all([
          studentsAPI.getById(id),
          attendanceAPI.getStudentAttendance(id)
        ]);
        setStudent(studentRes.data);
        setAttendanceData(attendanceRes.data);
      } catch (error) {
        toast.error("Failed to load student profile");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const pct = attendanceData?.overallPct ?? 0;
  const isWarning = pct < 75;
  const attColor = getAttendanceColor(pct);

  if (loading && !student) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-primary animate-pulse font-playfair text-xl">Loading Student Profile...</div>
      </div>
    );
  }

  return (
    <div className="page-container relative">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-surfaceLight/50 text-gray-400 hover:text-white hover:bg-surfaceLight transition-all border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-playfair font-bold text-white"
            >
              Student Profile
            </motion.h2>
            <p className="text-sm text-gray-400 mt-1">Detailed attendance and academic overview</p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary font-mono text-sm self-start sm:self-center">
          {currentTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        {/* Student Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 glass-card p-6 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-primary" />
          
          <div className="relative mb-4 group">
            {student?.avatar ? (
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-24 h-24 rounded-2xl object-cover border-2 border-primary/30 shadow-lg group-hover:border-primary transition-all duration-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/30 shadow-lg">
                <User size={40} className="text-primary" />
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 border-4 border-[#0a0f18] flex items-center justify-center text-white">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">{student?.name}</h3>
          <p className="text-xs text-primary font-mono tracking-widest mb-4">{student?.roll}</p>

          <div className="w-full space-y-3 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-surfaceLight flex items-center justify-center text-gray-400">
                <Mail size={14} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Email Address</p>
                <p className="text-xs text-gray-300 truncate">{student?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-surfaceLight flex items-center justify-center text-gray-400">
                <GraduationCap size={14} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">Department</p>
                <p className="text-xs text-gray-300 truncate">{student?.department || "Not Specified"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 flex flex-col justify-between border-l-4 border-primary shadow-xl"
          >
             <div>
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/10 mb-4">
                <BookOpen size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Total Classes</p>
              <p className="text-3xl font-playfair font-bold text-white mt-1">{attendanceData?.totalClasses || 0}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Calculated from enrollment date
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 flex flex-col justify-between border-l-4 border-emerald-500 shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 border border-emerald-500/10 mb-4">
                <Award size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Attended</p>
              <p className="text-3xl font-playfair font-bold text-white mt-1">{attendanceData?.attendedClasses || 0}</p>
            </div>
             <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified AI check-ins
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 flex flex-col justify-between border-l-4 border-orange-500 shadow-xl"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center text-orange-400 border border-orange-500/10 mb-4">
                <Zap size={20} />
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Attendance Pct</p>
              <p className={`text-3xl font-playfair font-bold mt-1 ${attColor}`}>{pct}%</p>
            </div>
             <p className="text-[10px] text-gray-400 mt-4 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              {pct >= 75 ? 'Above threshold' : 'Requires attention'}
            </p>
          </motion.div>
        </div>
      </div>

      {!loading && isWarning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-4 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-sm mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-red-400 font-bold text-base">Critical Attendance Warning</p>
            <p className="text-gray-400 mt-1 leading-relaxed">
              This student has fallen below the <strong>75%</strong> attendance threshold. 
              Current standing is <strong className="text-red-400">{pct}%</strong>. 
              Academic exclusion may apply if attendance doesn't improve.
            </p>
          </div>
        </motion.div>
      )}

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
              <div className="relative w-48 h-48 mb-6 font-playfair font-bold">
                <svg
                  className="w-full h-full -rotate-90 drop-shadow-2xl"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="#1e293b"
                    strokeWidth="8"
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
                    className={`text-5xl font-playfair font-bold drop-shadow-lg ${attColor}`}
                  >
                    {pct}%
                  </span>
                </div>
              </div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">
                Overall Standing
              </h3>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-white/5 ${
                pct >= 85 ? "bg-emerald-500/10 text-emerald-400" : pct >= 75 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"
              }`}>
                {pct >= 85 ? "Distinguished" : pct >= 75 ? "Satisfactory" : "Low Attendance"}
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
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={18} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Performance by Subject
            </h3>
          </div>
          {loading ? (
            <div className="skeleton h-64 rounded-2xl" />
          ) : (
            <>
              <SubjectChart data={attendanceData?.subjects ?? []} />
              <div className="mt-8 space-y-4">
                {(attendanceData?.subjects || []).map((sub) => (
                  <div key={sub.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-300 group-hover:text-primary transition-colors">
                        {sub.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${sub.percentage >= 85 ? "text-emerald-400" : sub.percentage >= 75 ? "text-amber-400" : "text-red-400"}`}>
                          {sub.percentage}%
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 bg-surfaceLight px-2 py-0.5 rounded">
                          {sub.present}/{sub.total}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sub.percentage}%` }}
                        transition={{
                          duration: 1,
                          ease: "circOut",
                        }}
                        className={`h-full rounded-full ${sub.percentage >= 85 ? "bg-emerald-400" : sub.percentage >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
