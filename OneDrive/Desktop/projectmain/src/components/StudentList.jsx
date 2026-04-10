import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Fingerprint, Activity, AlertTriangle, Crosshair, TerminalSquare, RefreshCw } from 'lucide-react';

const mockStudents = [
  { id: '1094', name: 'Alina Rostova', status: 'verified', match: 99.8, branch: 'Engineering', time: '08:14:02' },
  { id: '8832', name: 'Marcus Chen', status: 'verified', match: 98.5, branch: 'Design', time: '08:14:15' },
  { id: '4019', name: 'Sarah Jenkins', status: 'processing', match: null, branch: 'Marketing', time: '08:14:33' },
  { id: '2281', name: 'Unknown Proxy', status: 'anomaly', match: 12.4, branch: '--', time: '08:14:41' }
];

const StudentList = () => {
  const [students, setStudents] = useState(mockStudents.slice(0, 2));
  const [activeRow, setActiveRow] = useState(null);

  useEffect(() => {
    // Simulate real-time data incoming
    const timer1 = setTimeout(() => {
      setStudents(prev => [...prev, mockStudents[2]]);
    }, 2000);

    const timer2 = setTimeout(() => {
      setStudents(prev => {
        const next = [...prev];
        next[2] = { ...next[2], status: 'verified', match: 97.2 };
        return next;
      });
    }, 4500);

    const timer3 = setTimeout(() => {
      setStudents(prev => [mockStudents[3], ...prev]);
    }, 7000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter font-headline text-cyan-400">Live Recognition Feed</h2>
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20 cursor-pointer hover:bg-cyan-500/20 transition-colors">
          <Activity size={14} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">Streaming</span>
        </div>
      </div>

      <div className="ultra-glass rounded-xl p-4 md:p-6 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-2">
          <div className="col-span-1 hidden md:block">Time</div>
          <div className="col-span-4 md:col-span-3">Subject</div>
          <div className="col-span-3 hidden md:block">Department</div>
          <div className="col-span-4 md:col-span-2">Match Confidence</div>
          <div className="col-span-4 md:col-span-3 text-right">Status</div>
        </div>

        {/* List Body */}
        <div className="flex flex-col gap-3 min-h-[300px]">
          <AnimatePresence>
            {students.map((student, i) => {
              const isAnomaly = student.status === 'anomaly';
              const isProcessing = student.status === 'processing';
              const isHovered = activeRow === student.id;
              
              return (
                <motion.div
                  key={student.id + student.status}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  onHoverStart={() => setActiveRow(student.id)}
                  onHoverEnd={() => setActiveRow(null)}
                  className={`grid grid-cols-12 gap-4 items-center p-3 rounded-lg border cursor-crosshair ${
                    isAnomaly ? 'bg-rose-500/10 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]' : 
                    isProcessing ? 'bg-white/5 border-white/10' : 
                    'bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40'
                  } transition-all duration-300 relative overflow-hidden group`}
                >
                  {/* Scanning scanline effect for processing state */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent animate-scanline" />
                  )}
                  
                  {/* Hover interactive glitch line */}
                  <div className={`absolute left-0 top-0 w-1 h-full bg-cyan-400 scale-y-0 ${isHovered && !isAnomaly && !isProcessing ? 'scale-y-100' : ''} transition-transform duration-300 origin-top`}></div>

                  {/* Timestamp */}
                  <div className="hidden md:block col-span-1 relative z-10 text-[10px] font-mono text-zinc-500">
                    {student.time}
                  </div>

                  {/* Subject Name & ID */}
                  <div className="col-span-6 md:col-span-3 flex items-center gap-3 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${isHovered ? 'scale-110' : ''} ${
                      isAnomaly ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {isAnomaly ? <AlertTriangle size={14} className={isHovered ? "animate-pulse" : ""} /> : <UserCheck size={14} />}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isAnomaly ? 'text-rose-100' : 'text-on-surface'} flex items-center gap-2`}>
                        {student.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 group-hover:text-cyan-500/70 transition-colors">
                        <Fingerprint size={10} /> ID: {student.id}
                      </div>
                    </div>
                  </div>

                  {/* Department (Desktop) */}
                  <div className="hidden md:block col-span-3 relative z-10">
                    <span className={`text-xs px-2 py-1 rounded-md border transition-colors ${isHovered && !isAnomaly ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-100' : 'text-zinc-400 bg-black/40 border-white/5'}`}>
                      {student.branch}
                    </span>
                  </div>

                  {/* Match Confidence */}
                  <div className="col-span-3 md:col-span-2 relative z-10 hidden sm:block">
                    {student.match ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <span className={`text-xs font-mono font-bold ${isAnomaly ? 'text-rose-400' : 'text-cyan-400'}`}>
                             {student.match}%
                           </span>
                        </div>
                        <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.match}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full ${isAnomaly ? 'bg-rose-500' : 'bg-cyan-400'} shadow-[0_0_10px_currentColor]`}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 font-mono animate-pulse flex items-center gap-1">
                        <RefreshCw size={10} className="animate-spin" /> Calculating...
                      </div>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="col-span-6 md:col-span-3 flex justify-end items-center gap-2 relative z-10">
                    {/* Hover Actions */}
                    <AnimatePresence>
                      {isHovered && !isProcessing && (
                        <motion.div 
                           initial={{ opacity: 0, x: 10 }}
                           animate={{ opacity: 1, x: 0 }}
                           exit={{ opacity: 0, x: 10 }}
                           className="hidden md:flex items-center gap-1 mr-2"
                        >
                           <button className="p-1.5 rounded-full bg-black/50 border border-white/10 text-zinc-400 hover:text-cyan-400 hover:border-cyan-400/50 transition-colors" title="View Payload">
                             <TerminalSquare size={12} />
                           </button>
                           {isAnomaly && (
                             <button className="p-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors" title="Force Isolate">
                               <Crosshair size={12} />
                             </button>
                           )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest transition-transform ${isHovered ? 'scale-105' : ''} ${
                      isAnomaly ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                      isProcessing ? 'bg-zinc-500/20 text-zinc-400 border border-zinc-500/30' :
                      'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    }`}>
                      {isAnomaly ? 'Proxy Detected' : isProcessing ? 'Scanning' : 'Authenticated'}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
