import React from 'react';
import { motion } from 'framer-motion';
import StudentList from './StudentList';

const Home = ({ anomalyDetected }) => {
  // Container animation logic to stagger children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { ease: 'easeInOut', duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" exit="exit" className="pt-16 pb-32">
      {/* Feature 1: Biometric Core Hero */}
      <motion.section variants={itemVariants} className="relative min-h-[750px] flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[140px] -z-10"></div>
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[100px] -z-10"></div>
        
        <div className="absolute inset-0 pointer-events-none -z-5">
          <div className="float-data absolute top-1/4 left-1/4 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded text-[8px] font-mono text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{ animationDelay: '0s' }}>0x7F2A..E9</div>
          <div className="float-data absolute top-1/3 right-1/4 bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded text-[8px] font-mono text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]" style={{ animationDelay: '1.5s' }}>PKT_SEND_102</div>
          <div className="float-data absolute bottom-1/3 left-1/3 bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded text-[8px] font-mono text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.2)]" style={{ animationDelay: '0.8s' }}>LAT: -12.2</div>
          <div className="float-data absolute bottom-1/4 right-1/3 bg-purple-500/10 border border-purple-500/30 px-2 py-1 rounded text-[8px] font-mono text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.2)]" style={{ animationDelay: '2.2s' }}>AUTH: VAL</div>
        </div>

        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center">
          {/* The Biometric Orb */}
          <motion.div 
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.8, 1, 0.8] }} 
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${anomalyDetected ? 'from-rose-500/15 to-red-500/15 border-rose-500/40 shadow-[0_0_100px_rgba(244,63,94,0.25)]' : 'from-cyan-500/15 to-purple-500/15 border-cyan-500/40 shadow-[0_0_100px_rgba(34,211,238,0.25)]'} border-2 backdrop-blur-3xl`} 
          />
          
          <div className="absolute inset-10 rounded-full overflow-hidden perspective-grid">
            <svg className="w-full h-full opacity-60" viewBox="0 0 100 100">
              <defs>
                <pattern height="4" id="grid_dense" patternUnits="userSpaceOnUse" width="4">
                  <path d="M 4 0 L 0 0 0 4" fill="none" stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeWidth="0.05" />
                </pattern>
              </defs>
              <rect fill="url(#grid_dense)" height="100" width="100" />
              <circle cx="50" cy="50" fill="none" r="48" stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeOpacity="0.4" strokeWidth="0.3" />
              <circle cx="50" cy="50" fill="none" r="40" stroke="#a855f7" strokeDasharray="1,2" strokeOpacity="0.6" strokeWidth="0.15" />
              <circle cx="50" cy="50" fill="none" r="30" stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeOpacity="0.3" strokeWidth="0.1" />
              <line stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeWidth="0.4" x1="50" x2="50" y1="0" y2="10" />
              <line stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeWidth="0.4" x1="50" x2="50" y1="90" y2="100" />
              <line stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeWidth="0.4" x1="0" x2="10" y1="50" y2="50" />
              <line stroke={anomalyDetected ? "#f43f5e" : "#22d3ee"} strokeWidth="0.4" x1="90" x2="100" y1="50" y2="50" />
            </svg>
            <div className="scanline"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="absolute -top-12 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full border border-green-500/30 backdrop-blur-md flicker-anim">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <span className="text-[9px] font-bold text-green-400 uppercase tracking-widest">Liveness: Verified</span>
            </div>
            <span className={`material-symbols-outlined text-7xl md:text-9xl ${anomalyDetected ? 'text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.4)]' : 'text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>center_focus_strong</span>
            <div className="mt-6 flex flex-col items-center">
              <span className={`text-[11px] tracking-[0.4em] font-bold ${anomalyDetected ? 'text-rose-300' : 'text-cyan-300'} font-label uppercase`}>Scanning Identity</span>
              <span className="text-[10px] text-zinc-500 font-label mt-1">LAT: 34.05 / LONG: -118.24</span>
            </div>
          </div>
        </div>

        <motion.div variants={itemVariants} className="mt-16 text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-on-surface mb-6 font-headline leading-tight">
            Next-Gen Attendance <br /> <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Fueled by Biometrics</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto mb-10 font-body">
            Automate enterprise identity verification with high-performance edge computing. No cards. No friction. Only presence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-on-surface font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-cyan-500/20">
              Initialize Terminal
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 ultra-glass text-primary font-bold rounded-xl active:scale-95 transition-all hover:bg-white/5 relative overflow-hidden group">
              <span className="relative z-10">View API Documentation</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </motion.button>
          </div>
        </motion.div>
      </motion.section>

      {/* Feature 2: System Status Bento Box */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <motion.div variants={itemVariants} className="flex flex-col mb-12">
          <h2 className="text-2xl font-bold tracking-tighter font-headline text-cyan-400">System Status</h2>
          <div className="h-1 w-12 bg-gradient-to-r from-cyan-500 to-purple-500 mt-2 rounded-full"></div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4">
          <motion.div variants={itemVariants} className="md:col-span-2 md:row-span-2 ultra-glass rounded-xl p-8 relative overflow-hidden group border border-white/5 hover:border-cyan-500/30 transition-colors duration-500">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
              <span className="material-symbols-outlined text-9xl text-cyan-400">query_stats</span>
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-widest uppercase rounded-full ring-1 ring-cyan-500/30">Live Feed</span>
                <h3 className="text-3xl font-bold tracking-tighter mt-4 text-on-surface">Neural Engine Performance</h3>
                <p className="text-zinc-500 mt-2 text-sm">Processing 2.4k identity packets per second across all global nodes.</p>
              </div>
              <div className="mt-8">
                <div className="flex items-end gap-1 h-32">
                  {[50, 66, 75, 50, 100, 83, 66].map((h, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: 0 }} 
                      whileInView={{ height: `${h}%` }} 
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1, duration: 1, type: "spring" }}
                      className={`w-full ${h === 100 ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] cursor-pointer hover:bg-cyan-300 transition-colors' : 'bg-cyan-500/20 cursor-pointer hover:bg-cyan-500/40 transition-colors'} rounded-t-sm relative group`} 
                    >
                       <div className="absolute bottom-full mb-2 bg-black/80 px-2 py-1 rounded text-[9px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                         {h}%
                       </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-label text-zinc-500 uppercase tracking-widest">
                  <span>08:00 AM</span>
                  <span>12:00 PM</span>
                  <span>04:00 PM</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02, rotate: 1 }} className="md:col-span-1 ultra-glass rounded-xl p-6 border border-white/5 hover:border-cyan-500/40 transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="material-symbols-outlined text-purple-400">face</span>
              <span className="text-xs text-green-400 font-bold">+0.02%</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-on-surface relative z-10">99.98%</span>
            <p className="text-zinc-500 text-[10px] font-label uppercase tracking-widest mt-1 relative z-10">Recognition Accuracy</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.02, rotate: -1 }} className="md:col-span-1 ultra-glass rounded-xl p-6 border border-white/5 hover:border-cyan-500/40 transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <span className="material-symbols-outlined text-cyan-400">hub</span>
              <span className="text-xs text-cyan-400 font-bold relative z-10">Online</span>
              <div className="absolute right-0 top-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-on-surface relative z-10">1,242</span>
            <p className="text-zinc-500 text-[10px] font-label uppercase tracking-widest mt-1 relative z-10">Active Edge Nodes</p>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.01 }} className="md:col-span-2 ultra-glass rounded-xl p-6 border border-white/5 hover:border-purple-500/40 transition-colors duration-300 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-15 group-hover:rotate-12 transition-all duration-700">
              <span className="material-symbols-outlined text-[120px] text-on-surface">terminal</span>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h4 className="text-lg font-bold tracking-tighter text-on-surface mb-1">Seamless API Pipeline</h4>
                <p className="text-zinc-500 text-xs">Connect to any HRIS or Security infrastructure with a single REST hook.</p>
              </div>
              <motion.code whileHover={{ scale: 1.05 }} className="bg-black/60 px-4 py-2 rounded-lg text-cyan-400 text-[10px] font-mono border border-white/10 whitespace-nowrap cursor-ns-resize shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                POST /v1/biometric/auth
              </motion.code>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature 3: Live Student Monitoring (Framer Motion Enhanced) */}
      <motion.section variants={itemVariants} className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <StudentList />
      </motion.section>
    </motion.div>
  );
};

export default Home;
