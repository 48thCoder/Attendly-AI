import { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { recordsAPI } from "../services/api";
import { formatDate, recordsToCSV, downloadCSV } from "../utils/helpers";
import { SkeletonCard } from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const FILTERS = [
  { key: "today", label: "Today" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "custom", label: "Custom" },
];

export const Records = () => {
  const [filter, setFilter] = useState("today");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [exporting, setExporting] = useState(false);
  const [atRiskOnly, setAtRiskOnly] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (filter === "custom" && (!customStart || !customEnd)) {
        setRecords([]);
        return;
      }
      setLoading(true);
      try {
        const res = await recordsAPI.getRecords(filter, customStart, customEnd);
        setRecords(res.data);
      } catch {
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [filter, customStart, customEnd]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const csv = recordsToCSV(records);
      downloadCSV(
        csv,
        `attendance-${filter}-${new Date().toISOString().slice(0, 10)}.csv`,
      );
      toast.success("CSV exported successfully");
    } finally {
      setExporting(false);
    }
  };

  const displayedRecords = atRiskOnly
    ? records.filter((r) => r.rate < 75)
    : records;

  const totalPresent = displayedRecords.reduce((s, r) => s + r.present, 0);
  const totalAbsent = displayedRecords.reduce((s, r) => s + r.absent, 0);
  const avgRate = displayedRecords.length
    ? Math.round(
        displayedRecords.reduce((s, r) => s + r.rate, 0) /
          displayedRecords.length,
      )
    : 0;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-playfair font-bold text-white"
          >
            Attendance Records
          </motion.h2>
          <p className="text-sm text-gray-400 mt-1">
            View and export historical attendance data
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading}
          className="btn-primary self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={15} className={exporting ? "animate-bounce" : ""} />
          {exporting ? "Exporting..." : "Export CSV"}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Present",
            value: totalPresent,
            color: "text-emerald-400",
            icon: TrendingUp,
          },
          {
            label: "Total Absent",
            value: totalAbsent,
            color: "text-red-400",
            icon: TrendingDown,
          },
          {
            label: "Avg Rate",
            value: `${avgRate}%`,
            color: "text-primary",
            icon: Filter,
          },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`text-xl font-playfair font-bold ${color}`}>
              {loading ? "—" : value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar size={15} />
              <span>Filter:</span>
            </div>

            <div className="flex p-1 bg-background rounded-xl border border-surfaceLight">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filter === f.key
                      ? "bg-primary text-background shadow-lg shadow-primary/20"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {filter === "custom" && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <div className="flex items-center bg-background border border-surfaceLight rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all px-2">
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="bg-transparent text-white py-1.5 text-xs outline-none w-28 [color-scheme:dark]"
                    />
                  </div>
                  <span className="text-gray-600">→</span>
                  <div className="flex items-center bg-background border border-surfaceLight rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all px-2">
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="bg-transparent text-white py-1.5 text-xs outline-none w-28 [color-scheme:dark]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setAtRiskOnly(!atRiskOnly)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
              atRiskOnly
                ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-surfaceLight/30 text-gray-500 border-surfaceLight hover:text-white"
            }`}
          >
            <TrendingDown size={14} /> At Risk Only
          </button>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} className="h-14" />
            ))}
          </div>
        ) : displayedRecords.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-surfaceLight flex items-center justify-center mb-4 text-gray-600 border border-surfaceLight/50">
              <Filter size={32} strokeWidth={1.5} />
            </div>
            <h4 className="text-white font-semibold mb-1">No matches found</h4>
            <p className="text-gray-500 text-sm max-w-[240px] leading-relaxed">
              We couldn't find any attendance logs for the current filter
              selection.
            </p>
            <button
              onClick={() => {
                setFilter("today");
                setAtRiskOnly(false);
              }}
              className="mt-6 text-primary hover:underline text-sm font-medium flex items-center gap-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surfaceLight bg-surfaceLight/30">
                  {[
                    "Date",
                    "Activity",
                    "Present",
                    "Absent",
                    "Attendance Rate",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-gray-500 font-semibold uppercase tracking-wider py-3.5 px-5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surfaceLight/50">
                {displayedRecords.map((rec, i) => (
                  <motion.tr
                    key={rec.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-surfaceLight/20 transition-colors group"
                  >
                    <td className="py-4 px-5 text-gray-300 font-medium">
                      {formatDate(rec.date)}
                    </td>
                    <td className="py-4 px-5 text-white">Daily check-in</td>
                    <td className="py-4 px-5">
                      <span className="text-emerald-400 font-semibold">
                        {rec.present}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-red-400 font-semibold">
                        {rec.absent}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rec.rate}%` }}
                            transition={{
                              delay: i * 0.05 + 0.3,
                              duration: 0.6,
                              ease: "easeOut",
                            }}
                            className={`h-full rounded-full ${rec.rate >= 85 ? "bg-emerald-400" : rec.rate >= 75 ? "bg-amber-400" : "bg-red-400"}`}
                          />
                        </div>
                        <span
                          className={`text-sm font-semibold ${rec.rate >= 85 ? "text-emerald-400" : rec.rate >= 75 ? "text-amber-400" : "text-red-400"}`}
                        >
                          {rec.rate}%
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};
