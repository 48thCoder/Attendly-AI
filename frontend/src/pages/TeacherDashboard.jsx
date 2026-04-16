import { useEffect, useState } from "react";
import { Users, UserX, UserCheck, Activity, RefreshCw } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { TodayDonutChart } from "../components/Charts/TodayDonutChart";
import { WeeklyBarChart } from "../components/Charts/WeeklyBarChart";
import { AttendanceTable } from "../components/AttendanceTable";
import { attendanceAPI } from "../services/api";
import { motion } from "framer-motion";
import { SkeletonCard } from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [todayRes, weeklyRes] = await Promise.all([
        attendanceAPI.getToday(),
        attendanceAPI.getWeeklyStats(),
      ]);
      setStats(todayRes.data);
      setWeeklyStats(weeklyRes.data);
      if (showRefresh) toast.success("Dashboard refreshed");
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats?.total ?? 0,
      icon: Users,
      color: "primary",
      trend: { value: "+2", label: "from last month", isPositive: true },
    },
    {
      title: "Present Today",
      value: stats?.present ?? 0,
      icon: UserCheck,
      color: "emerald",
      trend: {
        value: `${stats ? Math.round((stats.present / stats.total) * 100) : 0}%`,
        label: "attendance rate",
        isPositive: true,
      },
    },
    {
      title: "Absent Today",
      value: stats?.absent ?? 0,
      icon: UserX,
      color: "red",
      trend: { value: "-1", label: "from yesterday", isPositive: true },
    },
    {
      title: "AI Confidence",
      value: `${stats?.avgConfidence ?? 0}%`,
      icon: Activity,
      color: "blue",
      trend: { value: "+0.5%", label: "this week", isPositive: true },
    },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-playfair font-bold text-white"
          >
            Teacher Dashboard
          </motion.h2>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <span>
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="text-gray-600">|</span>
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
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="btn-ghost flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card, i) => (
              <StatCard key={card.title} {...card} index={i} />
            ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">
              Weekly Attendance
            </h3>
            <span className="text-xs text-gray-500 bg-surfaceLight px-2.5 py-1 rounded-full">
              This Week
            </span>
          </div>
          {loading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : (
            <WeeklyBarChart data={weeklyStats} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">
              Today's Summary
            </h3>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          {loading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : (
            <TodayDonutChart
              present={stats?.present ?? 0}
              absent={stats?.absent ?? 0}
            />
          )}
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">Recent Scans</h3>
          <a href="/records" className="text-xs text-primary">
            View all &nbsp; →
          </a>
        </div>
        <AttendanceTable records={stats?.recent ?? []} loading={loading} />
      </motion.div>
    </div>
  );
};
