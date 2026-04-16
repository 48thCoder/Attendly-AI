import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Play,
  Square,
  UserSearch,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  User,
  Fingerprint,
  Search,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scanAPI } from "../services/api";
import { formatTime } from "../utils/helpers";
import { Badge } from "../components/Badge";
import toast from "react-hot-toast";
import { FaceScanner } from "../face-api.js";

const STATUS = {
  ready: {
    label: "System Idle",
    color: "text-gray-400",
    bg: "bg-surfaceLight/50 border-surfaceLight",
    icon: UserSearch,
  },
  scanning: {
    label: "AI Processing...",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
    icon: Zap,
  },
  identified: {
    label: "Student Identified",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
    icon: CheckCircle,
  },
  manual: {
    label: "Manual Entry",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/30",
    icon: UserPlus,
  },
  unrecognized: {
    label: "Recognition Failed",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    icon: XCircle,
  },
};

export const LiveScan = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("ready");
  const [modelsReady, setModelsReady] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [scanLine, setScanLine] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showManualSearch, setShowManualSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(recentScans.length / itemsPerPage);
  const currentScans = recentScans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFaceMatch = async (detections) => {
    if (status === "identified" || status === "scanning") return;
    setStatus("scanning");
    setScanLine(true);
    try {
      const res = await scanAPI.recognize("default");
      const result = res.data;
      if (result.recognized) {
        setStatus("identified");
        setLastResult(result);
        logScan(result.student, detections[0].detection.score * 100);
        toast.success(`✅ ${result.student.name} marked present`);
      } else {
        setStatus("unrecognized");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanLine(false);
      setTimeout(() => setStatus("ready"), 3000);
    }
  };

  const handleManualMark = (student) => {
    setStatus("manual");
    setLastResult({ student, time: new Date().toISOString() });
    logScan(student, 100, true);
    setShowManualSearch(false);
    setSearchQuery("");
    toast.success(`✅ ${student.name} marked manually`);
    setTimeout(() => setStatus("ready"), 3000);
  };

  const logScan = (student, confidence, isManual = false) => {
    setRecentScans((prev) => [
      {
        id: Date.now(),
        name: student.name,
        roll: student.roll,
        confidence: Math.round(confidence),
        time: new Date().toISOString(),
        status: "present",
        isManual,
      },
      ...prev,
    ]);
    setCurrentPage(1);
  };

  const startContinuousScan = () => {
    setScanning(true);
    setStatus("ready");
    setShowManualSearch(false);
    toast.success("AI Face Scanner Started");
  };

  const stopScan = () => {
    setScanning(false);
    setStatus("ready");
    setScanLine(false);
    toast("Scanner Stopped", { icon: "⏸️" });
  };

  const s = STATUS[status] || STATUS.ready;

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col overflow-hidden">
      <div className="mb-4 flex items-center justify-between">
        <div>
            <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-playfair font-bold text-white tracking-tight"
            >
            Biometric Control Center
            </motion.h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Neural Engine v2.4 Active
            </p>
        </div>
        <button 
            onClick={() => {
                if (scanning) stopScan();
                setShowManualSearch(!showManualSearch);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${showManualSearch ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20' : 'bg-surfaceLight/50 text-gray-400 border-white/5 hover:text-primary hover:border-primary/30'}`}
        >
            <Search size={14} />
            {showManualSearch ? 'Close Search' : 'Manual Entry'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0 overflow-hidden">
        <div className="lg:col-span-3 flex flex-col min-h-0 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card flex-1 p-5 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
          >
            <AnimatePresence mode="wait">
                {showManualSearch ? (
                    <motion.div 
                        key="search"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-md space-y-6"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                                <Search size={32} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-playfair font-bold text-white uppercase tracking-tight">Manual Override</h3>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Search Student Registry</p>
                        </div>
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter Name or Roll Number..."
                                className="w-full bg-background/60 border-2 border-surfaceLight rounded-2xl px-12 py-4 text-white placeholder-gray-600 focus:border-primary/50 focus:outline-none transition-all shadow-2xl"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={20} />
                        </div>
                        
                        {searchQuery.length >= 2 && (
                            <div className="bg-background/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl divide-y divide-white/5 max-h-[180px] overflow-y-auto custom-scrollbar">
                                {/* Simulated Search Results */}
                                {[
                                    { name: "Aryan Sharma", roll: "CS2101", avatar: "https://i.pravatar.cc/150?u=aryan" },
                                    { name: "Priya Singh", roll: "CS2105", avatar: "https://i.pravatar.cc/150?u=priya" }
                                ].filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.roll.toLowerCase().includes(searchQuery.toLowerCase())).map(student => (
                                    <button 
                                        key={student.roll}
                                        onClick={() => handleManualMark(student)}
                                        className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-primary/5 transition-colors group"
                                    >
                                        <img src={student.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" />
                                        <div className="text-left flex-1">
                                            <p className="text-sm font-bold text-white uppercase tracking-tight">{student.name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{student.roll}</p>
                                        </div>
                                        <UserPlus size={18} className="text-gray-700 group-hover:text-primary transition-colors" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div 
                        key="camera"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-surfaceLight w-full" 
                        style={{ maxWidth: 500 }}
                    >
                        <div className="aspect-[4/3] bg-background relative">
                            <FaceScanner 
                            isScanning={scanning} 
                            onMatchFound={handleFaceMatch}
                            onModelsLoaded={() => setModelsReady(true)}
                            />
                            
                            <AnimatePresence>
                            {scanLine && (
                                <motion.div
                                initial={{ y: 0 }}
                                animate={{ y: "100%" }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent top-0 z-10"
                                style={{ boxShadow: "0 0 15px rgba(0, 255, 231, 0.9)" }}
                                />
                            )}
                            </AnimatePresence>

                            {scanning && (
                                <div className="absolute inset-0 pointer-events-none border-[12px] border-transparent">
                                    <div className={`absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 ${status === 'identified' ? 'border-emerald-400' : 'border-primary/50'}`} />
                                    <div className={`absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 ${status === 'identified' ? 'border-emerald-400' : 'border-primary/50'}`} />
                                    <div className={`absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 ${status === 'identified' ? 'border-emerald-400' : 'border-primary/50'}`} />
                                    <div className={`absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 ${status === 'identified' ? 'border-emerald-400' : 'border-primary/50'}`} />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>

          <div className="glass-card p-4 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${modelsReady ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surfaceLight text-gray-600'}`}>
                        <Fingerprint size={18} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight leading-none mb-1">Scanner Hardware</p>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">{modelsReady ? 'Ready for Capture' : 'Warm-up in progress...'}</p>
                    </div>
                </div>
                {!scanning ? (
                  <button
                    onClick={startContinuousScan}
                    disabled={!modelsReady || showManualSearch}
                    className="btn-primary w-full sm:w-auto px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-30"
                  >
                    {!modelsReady ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Play size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider">{!modelsReady ? 'Calibrating...' : 'Start Scanner'}</span>
                  </button>
                ) : (
                  <button
                    onClick={stopScan}
                    className="w-full sm:w-auto px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 float-animation transition-all"
                  >
                    <Square size={14} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Stop Session</span>
                  </button>
                )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col min-h-0 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-5 border-l-4 border-primary shrink-0 min-h-[160px]"
          >
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Profile</h3>
                <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-tighter transition-all ${s.bg} ${s.color}`}>
                   <span className="flex items-center gap-1.5">
                    <s.icon size={10} className={status === 'scanning' ? 'animate-spin' : ''} />
                    {s.label}
                   </span>
                </div>
             </div>

             <div className="flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {(status === "identified" || status === "manual") && lastResult ? (
                        <motion.div
                            key="identified"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex items-center gap-4"
                        >
                            <img 
                                src={lastResult.student.avatar} 
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/30 shadow-xl" 
                                alt="" 
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-white tracking-tight leading-none truncate uppercase">{lastResult.student.name}</h4>
                                <p className="text-xs text-primary font-mono font-bold mt-1.5">{lastResult.student.roll}</p>
                                <div className="mt-2.5 flex items-center gap-3">
                                    <div className="bg-background/40 px-2 py-1 rounded-lg border border-white/5">
                                        <p className="text-[8px] text-gray-500 uppercase font-black leading-none">Score</p>
                                        <p className="text-[10px] font-bold text-emerald-400 mt-1">{status === 'manual' ? '100%' : '98.4%'}</p>
                                    </div>
                                    <div className="bg-background/40 px-2 py-1 rounded-lg border border-white/5 flex-1">
                                        <p className="text-[8px] text-gray-500 uppercase font-black leading-none">Entry Type</p>
                                        <p className={`text-[10px] font-bold uppercase tracking-tighter mt-1 truncate ${status === 'manual' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                            {status === 'manual' ? 'Manual' : 'System Match'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center text-center py-4 border-2 border-dashed border-white/5 rounded-2xl"
                        >
                            <User size={24} className="text-gray-700 mb-2" />
                            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                                {status === 'scanning' ? 'Neural Match in progress...' : 'Detection Pending...'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 flex-1 flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-tight">Recent Activity Log</h3>
              <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 uppercase">
                {recentScans.length} Entries
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-1 -mx-1 custom-scrollbar">
              {recentScans.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-20 italic">
                  <Clock size={20} className="mb-2" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">No logs yet</p>
                </div>
              ) : (
                <div className="space-y-2 pb-4">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {currentScans.map((scan) => (
                      <motion.div
                        key={scan.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`flex items-center gap-3 p-2.5 bg-background/40 rounded-xl border hover:border-primary/20 transition-all ${scan.isManual ? 'border-blue-500/20' : 'border-white/5'}`}
                      >
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${scan.isManual ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/10 text-emerald-400'}`}>
                          {scan.isManual ? <UserPlus size={14} /> : <CheckCircle size={14} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight">
                            {scan.name}
                          </p>
                          <p className="text-[9px] text-gray-500 font-mono mt-0.5">
                            {scan.roll} · <span className={scan.isManual ? 'text-blue-400/70' : 'text-primary/70'}>{scan.isManual ? 'Manual Overide' : `${scan.confidence}% Match`}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[9px] text-gray-500 font-bold">
                            {formatTime(scan.time)}
                          </p>
                          <div className="mt-1 scale-75 origin-right">
                             <Badge status={scan.status} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-surfaceLight/20 shrink-0">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-lg hover:bg-surfaceLight text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                  {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-lg hover:bg-surfaceLight text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
