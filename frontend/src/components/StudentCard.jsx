import { motion } from "framer-motion";
import { MoreVertical, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInitials,
  getAvatarColor,
  getAttendanceColor,
  getAttendanceBg,
} from "../utils/helpers";

export const StudentCard = ({ student, index = 0, onDelete }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = getInitials(student.name);
  const gradientClass = getAvatarColor(student.name);
  const pct = student.attendancePct || 0;
  const attColor = getAttendanceColor(pct);
  const barColor = getAttendanceBg(pct);

  const getStatusBadge = () => {
    if (pct >= 85) return { label: "Good", cls: "badge-present" };
    if (pct >= 75) return { label: "Average", cls: "badge-late" };
    return { label: "Critical", cls: "badge-absent" };
  };
  const badge = getStatusBadge();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="glass-card p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center flex-shrink-0 font-playfair font-bold text-white text-sm shadow-lg`}
          >
            {initials}
          </div>
          <div>
            <h4 className="font-semibold text-white group-hover:text-primary transition-colors leading-tight">
              {student.name}
            </h4>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              {student.roll}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-surfaceLight transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-20 bg-surfaceLight border border-surfaceLight rounded-xl shadow-xl w-40 py-1 text-sm">
                <button
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background hover:text-primary transition-colors text-gray-300"
                >
                  <Eye size={14} /> View Profile
                </button>
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(student.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-background hover:text-red-400 transition-colors text-gray-300"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{student.department}</span>
          <span className={badge.cls}>{badge.label}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Attendance</span>
            <span className={`text-sm font-semibold font-playfair ${attColor}`}>
              {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-surfaceLight rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: 0.8,
                delay: index * 0.05 + 0.3,
                ease: "easeOut",
              }}
              className={`h-full rounded-full ${barColor}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
