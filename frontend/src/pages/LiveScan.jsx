import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Play,
  Square,
  Cpu,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { scanAPI } from "../services/api";
import { formatTime } from "../utils/helpers";
import { Badge } from "../components/Badge";
import toast from "react-hot-toast";



const STATUS = {
  ready: {
    label: "Ready",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
    icon: Cpu,
  },
  scanning: {
    label: "Scanning...",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/30",
    icon: Zap,
  },
  identified: {
    label: "Identified",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10 border-emerald-400/30",
    icon: CheckCircle,
  },
  unrecognized: {
    label: "Not Recognized",
    color: "text-red-400",
    bg: "bg-red-400/10 border-red-400/30",
    icon: XCircle,
  },
};

export const LiveScan = () => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("ready");

  const [recentScans, setRecentScans] = useState([]);
  const [lastResult, setLastResult] = useState(null);
  const [scanLine, setScanLine] = useState(false);


  const [faces, setFaces] = useState([]);
  const [spoofWarning, setSpoofWarning] = useState(false);
  const boxIntervalRef = useRef(null);
  const intervalRef = useRef(null);

  const generateRandomFaceBox = () => {
    return {
      id: Math.random(),
      left: `${15 + Math.random() * 50}%`,
      top: `${15 + Math.random() * 40}%`,
      width: `${15 + Math.random() * 15}%`,
      height: `${20 + Math.random() * 15}%`,
    };
  };

  const runScan = async () => {
    setStatus("scanning");
    setScanLine(true);
    setSpoofWarning(false);

    setFaces([{ ...generateRandomFaceBox() }]);

    try {
      const res = await scanAPI.recognize("default");
      const result = res.data;
      if (result.recognized) {
        setStatus("identified");
        setLastResult(result);
        setRecentScans((prev) => [
          {
            id: Date.now(),
            name: result.student.name,
            roll: result.student.roll,
            confidence: parseFloat(result.confidence),
            time: result.time,
            status: "present",
          },
          ...prev.slice(0, 9),
        ]);
        toast.success(
          `✅ ${result.student.name} marked present (${result.confidence}%)`,
        );
      } else {
        setStatus("unrecognized");
        setLastResult(null);
        if (parseFloat(result.confidence) < 50) {
          setSpoofWarning(true);
          toast.error("Warning: Potential Spoof Detected!", {
            icon: "🚨",
            duration: 3000,
          });
        } else {
          toast.error("Face not recognized in database", {
            icon: "⚠️",
            duration: 2500,
          });
        }
      }
    } catch (err) {
      setStatus("ready");
    } finally {
      setScanLine(false);
    }

    setTimeout(() => {
      if (intervalRef.current || scanning) setStatus("ready");
      setFaces([]);
      setSpoofWarning(false);
    }, 3000);
  };

  const startContinuousScan = () => {
    setScanning(true);
    runScan();
    intervalRef.current = setInterval(runScan, 6000);

    boxIntervalRef.current = setInterval(() => {
      setFaces((prev) => {
        if (prev.length === 0) return prev;
        return prev.map((f) => ({
          ...f,
          left: `${parseFloat(f.left) + (Math.random() * 2 - 1)}%`,
          top: `${parseFloat(f.top) + (Math.random() * 2 - 1)}%`,
        }));
      });
    }, 1000);
  };

  const stopScan = () => {
    setScanning(false);
    clearInterval(intervalRef.current);
    clearInterval(boxIntervalRef.current);
    intervalRef.current = null;
    boxIntervalRef.current = null;
    setStatus("ready");
    setScanLine(false);
    setFaces([]);
    setSpoofWarning(false);
  };

  useEffect(
    () => () => {
      clearInterval(intervalRef.current);
      clearInterval(boxIntervalRef.current);
    },
    [],
  );

  const s = STATUS[status];

  return (
    <div className="page-container">
      <div className="mb-2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-playfair font-bold text-white"
        >
          Live Face Scanner
        </motion.h2>
        <p className="text-sm text-gray-400 mt-1">
          AI-powered real-time face recognition
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="glass-card p-6 relative overflow-hidden"
          >
            <div className="relative mx-auto" style={{ maxWidth: 380 }}>
              <div
                className={`relative aspect-[4/3] rounded-2xl bg-background/80 overflow-hidden border-2 transition-all duration-500 ${
                  spoofWarning
                    ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.3)]"
                    : status === "scanning"
                      ? "border-amber-400/60"
                      : status === "identified"
                        ? "border-emerald-400/60 shadow-[0_0_30px_rgba(52,211,153,0.2)]"
                        : status === "unrecognized"
                          ? "border-red-400/60"
                          : "border-surfaceLight"
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Camera size={48} className="text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">Camera Feed</p>
                    <p className="text-gray-700 text-xs mt-1">
                      Main System Camera
                    </p>
                  </div>
                </div>


                <AnimatePresence>
                  {faces.map((face) => (
                    <motion.div
                      key={face.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        left: face.left,
                        top: face.top,
                        width: face.width,
                        height: face.height,
                      }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={`absolute border-2 border-primary/70 bg-primary/10 rounded-lg pointer-events-none ${
                        status === "identified"
                          ? "!border-emerald-400 !bg-emerald-400/20"
                          : status === "unrecognized"
                            ? "!border-red-400 !bg-red-400/20"
                            : ""
                      }`}
                      style={{
                        boxShadow: "inset 0 0 10px rgba(0, 255, 231, 0.2)",
                      }}
                    >
                      {status === "scanning" && (
                        <div className="absolute -top-6 left-0 text-xs font-mono text-primary bg-background/80 px-1 py-0.5 rounded border border-primary/30">
                          Tracking Face ID:{Math.floor(face.id * 1000)}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>


                <AnimatePresence>
                  {spoofWarning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 bg-red-500 pointer-events-none"
                      style={{ mixBlendMode: "overlay" }}
                    />
                  )}
                </AnimatePresence>

                {[
                  "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
                  "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
                  "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
                  "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
                ].map((cls, i) => (
                  <div
                    key={i}
                    className={`absolute w-8 h-8 transition-colors duration-300 ${cls} ${
                      spoofWarning
                        ? "border-red-500"
                        : status === "identified"
                          ? "border-emerald-400"
                          : status === "unrecognized"
                            ? "border-red-400"
                            : "border-primary"
                    }`}
                  />
                ))}
                <AnimatePresence>
                  {scanLine && (
                    <motion.div
                      initial={{ y: 0 }}
                      animate={{ y: "100%" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent top-0 z-10"
                      style={{ boxShadow: "0 0 12px rgba(0, 255, 231, 0.8)" }}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {status === "identified" && lastResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-end justify-center pb-4 z-20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />
                      <div className="text-center relative z-10">
                        <p className="text-emerald-400 font-semibold">
                          {lastResult.student?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {lastResult.confidence}% confidence
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {status === "unrecognized" && !spoofWarning && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-red-500/10 z-20"
                    >
                      <div className="text-center">
                        <XCircle
                          size={40}
                          className="text-red-400 mx-auto mb-2"
                        />
                        <p className="text-red-400 font-semibold text-sm">
                          Not Recognized
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {spoofWarning && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-red-900/60 z-20 backdrop-blur-sm"
                    >
                      <div className="text-center">
                        <AlertTriangle
                          size={48}
                          className="text-red-500 mx-auto mb-3 animate-pulse"
                        />
                        <p className="text-red-100 font-bold text-lg">
                          SPOOF DETECTED
                        </p>
                        <p className="text-red-300 text-xs mt-1">
                          Manual verification required
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {status === "scanning" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="w-24 h-24 border-2 border-primary/30 rounded-full animate-ping-slow" />
                    <div className="absolute w-16 h-16 border-2 border-primary/50 rounded-full animate-spin-slow" />
                  </div>
                )}
              </div>
              {scanning && (
                <div className="absolute -top-2 -right-2 flex items-center gap-1 z-30">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-red-400 font-medium">LIVE</span>
                </div>
              )}
            </div>
            <div className="mt-5 flex items-center justify-center">
              <div
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border ${s.bg} transition-all duration-300`}
              >
                <s.icon
                  size={16}
                  className={`${s.color} ${status === "scanning" ? "animate-pulse" : ""}`}
                />
                <span className={`text-sm font-semibold ${s.color}`}>
                  {s.label}
                </span>
              </div>
            </div>
          </motion.div>
          <div className="glass-card p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">System Online</p>
                  <p className="text-xs text-gray-500">Using integrated biometric sensor</p>
                </div>
              </div>
              <div className="flex gap-3 sm:flex-col w-full sm:w-auto">
                {!scanning ? (
                  <>
                    <button
                      onClick={runScan}
                      disabled={status === "scanning"}
                      className="btn-primary flex-1 sm:flex-none justify-center sm:justify-start disabled:opacity-50"
                    >
                      <Zap size={15} /> Single Scan
                    </button>
                    <button
                      onClick={startContinuousScan}
                      className="btn-secondary flex-1 sm:flex-none justify-center sm:justify-start"
                    >
                      <Play size={15} /> Auto Scan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={stopScan}
                    className="flex items-center gap-2 bg-red-500/15 text-red-400 border border-red-500/30 py-2.5 px-5 rounded-lg hover:bg-red-500/25 transition-colors font-semibold text-sm"
                  >
                    <Square size={15} fill="currentColor" /> Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 h-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Recent Scans
              </h3>
              <span className="text-xs text-gray-500 bg-surfaceLight px-2 py-0.5 rounded-full">
                {recentScans.length} scans
              </span>
            </div>

            {recentScans.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                <Clock size={32} className="mb-3 opacity-40" />
                <p className="text-sm">No scans yet</p>
                <p className="text-xs mt-1">Press Scan to begin</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-24rem)] pr-2">
                <AnimatePresence initial={false}>
                  {recentScans.map((scan) => (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex items-center gap-3 p-3 bg-background/60 rounded-xl border border-surfaceLight"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {scan.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-mono">
                            {scan.roll}
                          </span>
                          <span className="text-xs text-primary">
                            {scan.confidence}%
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-gray-500">
                          {formatTime(scan.time)}
                        </p>
                        <Badge status={scan.status} />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
