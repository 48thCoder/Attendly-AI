
import { useState, useEffect } from 'react';
import { Search, UserPlus, Users, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { studentsAPI } from '../services/api';
import { StudentCard } from '../components/StudentCard';
import { SkeletonCard } from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['All', 'CSE Core', 'CSE (AI)', 'CSE (AIML)', 'AIML', 'CSE (DS)', 'CS (IT)', 'CSE (IOT)', 'CSE (H)'];

export const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  useEffect(() => {
    studentsAPI.getAll()
      .then(res => setStudents(res.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await studentsAPI.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      toast.success('Student removed');
    } catch {
      toast.error('Failed to remove student');
    }
  };

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.roll.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === 'All' || s.department === department;
    return matchSearch && matchDept;
  });

  const criticalCount = students.filter(s => s.attendancePct < 75).length;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
        <div>
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-playfair font-bold text-white">
            Student Registry
          </motion.h2>
          <p className="text-sm text-gray-400 mt-1">
            {students.length} students enrolled
            {criticalCount > 0 && (
              <span className="ml-2 text-amber-400 inline-flex items-center gap-1 text-xs">
                <AlertTriangle size={11} /> {criticalCount} below 75%
              </span>
            )}
          </p>
        </div>
        <Link to="/students/register" className="btn-primary self-start sm:self-auto">
          <UserPlus size={15} /> Add Student
        </Link>
      </div>
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, roll number or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DEPARTMENTS.map(d => (
              <button
                key={d}
                onClick={() => setDepartment(d)}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  department === d
                    ? 'bg-primary text-background'
                    : 'bg-surfaceLight text-gray-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-gray-400">{students.filter(s => s.attendancePct >= 85).length} Good</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-gray-400">{students.filter(s => s.attendancePct >= 75 && s.attendancePct < 85).length} Average</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-gray-400">{students.filter(s => s.attendancePct < 75).length} Critical</span>
        </div>
        <span className="ml-auto text-gray-500 text-xs">{filtered.length} shown</span>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} className="h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-surfaceLight flex items-center justify-center mb-5 text-gray-600 border border-surfaceLight/50">
            <Users size={32} strokeWidth={1.5} />
          </div>
          <h4 className="text-white font-semibold mb-1">No students found</h4>
          <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed">
            {search 
              ? `No results for "${search}" in the ${department} directory.` 
              : "The student database is currently empty. Start by registering a new student."}
          </p>
          {search ? (
            <button 
              onClick={() => { setSearch(''); setDepartment('All'); }}
              className="mt-6 text-primary hover:underline text-sm font-medium"
            >
              Clear Search & Filter
            </button>
          ) : (
            <Link to="/students/register" className="btn-primary mt-6">
              <UserPlus size={15} />
              Register First Student
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.map((student, i) => (
              <StudentCard key={student.id} student={student} index={i} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
