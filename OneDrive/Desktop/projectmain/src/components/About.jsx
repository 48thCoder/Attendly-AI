import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 1, title: 'Capture', icon: 'photo_camera', desc: 'Secure 4K visual array ingested via active Obsidian Lens.', metrics: { latency: '0.04s', confidence: 'N/A', activeNodes: 1242 } },
  { id: 2, title: 'Landmark', icon: 'face', desc: '20,000 mapping points plotted for deep geometrical analysis.', metrics: { latency: '0.08s', confidence: '98.5%', activeNodes: 432 } },
  { id: 3, title: 'Embedding', icon: 'fingerprint', desc: '1024-dimensional feature vector extraction and compression.', metrics: { latency: '0.02s', confidence: '99.1%', activeNodes: 432 } },
  { id: 4, title: 'Vector DB', icon: 'hub', desc: 'Sub-millisecond similarity search against billions of records.', metrics: { latency: '0.01s', confidence: '99.8%', activeNodes: 89 } },
  { id: 5, title: 'Gemini Core', icon: 'psychology', desc: 'Neural heuristics applied for advanced liveness detection.', metrics: { latency: '0.05s', confidence: '99.99%', activeNodes: 14 } },
  { id: 6, title: 'Auth', icon: 'lock_open', desc: 'Secure JWT generated and dispatched to local edge nodes.', metrics: { latency: '0.01s', confidence: '100%', activeNodes: 1242 } }
];

const About = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-play the pipeline
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.4 }}
      className="pt-32 pb-32 max-w-7xl mx-auto px-6"
    >
      <div className="text-center mb-20 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-on-surface mb-6 font-headline">
          The <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Biometric Pipeline</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-body">
          Dive into our 6-step deep architecture. Hover over nodes to pause processing and inspect terminal telemetry. Each facial query goes through rigorous mathematical mapping and neural verification before local authorization happens in roughly 0.2s.
        </p>
      </div>

      <div className="relative mt-12 py-10" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {/* Main central horizontal connecting line */}
        <div className="absolute top-[80px] left-0 w-full h-1 bg-white/5 rounded-full overflow-hidden hidden md:block">
           <motion.div 
             className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500 shadow-[0_0_10px_#a855f7]"
             initial={{ width: '0%' }}
             animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
             transition={{ duration: 0.8, ease: "easeInOut" }}
           />
        </div>

        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isPassed = index <= activeStep;
            return (
              <motion.div 
                key={step.id} 
                className={`flex-1 flex flex-row md:flex-col items-center gap-6 cursor-pointer group p-2 rounded-xl transition-colors ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Node */}
                <motion.div 
                  className={`relative shrink-0 flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500 ${
                    isActive ? 'bg-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.4)] border border-cyan-400' :
                    isPassed ? 'bg-purple-500/10 border border-purple-500/30 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10' : 'ultra-glass border border-white/5 opacity-50 group-hover:opacity-100 group-hover:border-cyan-400/30'
                  }`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{ repeat: isActive ? Infinity : 0, duration: 2 }}
                >
                  <span className={`material-symbols-outlined text-2xl transition-colors duration-500 ${
                    isActive ? 'text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]' :
                    isPassed ? 'text-purple-400 group-hover:text-cyan-300' : 'text-zinc-500 group-hover:text-cyan-500/50'
                  }`}>{step.icon}</span>
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-20"></div>
                  )}
                </motion.div>

                {/* Details */}
                <div className={`md:text-center flex-1 transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : isPassed ? 'opacity-70 group-hover:opacity-100' : 'opacity-40 group-hover:opacity-100'
                }`}>
                  <h3 className={`text-lg font-bold font-headline mb-2 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-on-surface group-hover:text-cyan-300'
                  }`}>{step.title}</h3>
                  <p className="text-[10px] sm:text-xs text-zinc-500 leading-relaxed font-body">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Hero Visualizer for the active step */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`visualizer-${activeStep}`}
          initial={{ opacity: 0, filter: 'blur(20px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          exit={{ opacity: 0, filter: 'blur(10px)', y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-16 ultra-glass p-6 md:p-8 rounded-2xl max-w-4xl mx-auto border-t border-cyan-500/30 shadow-[0_20px_60px_rgba(34,211,238,0.05)] relative overflow-hidden flex flex-col md:flex-row items-center gap-8"
        >
          <div className="absolute -left-20 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="w-24 h-24 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shrink-0 relative z-10 group shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
               <span className="material-symbols-outlined text-5xl text-purple-400 group-hover:text-cyan-400 transition-colors duration-300">
                 {steps[activeStep].icon}
               </span>
               <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </div>

          <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-[10px] text-cyan-400 font-mono tracking-widest mb-2 uppercase flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
                 Step 0{steps[activeStep].id} Active
              </div>
              <h2 className="text-2xl font-bold font-headline text-on-surface mb-2">{steps[activeStep].title} Process</h2>
              <p className="text-sm text-zinc-400 mb-4">{steps[activeStep].desc} This operation is typically performed on the edge node nearest to the scan terminal using quantized deep learning models.</p>
            </div>

            {/* Simulated Telemetry Dashboard */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono">
              <div className="text-[9px] text-zinc-500 tracking-widest uppercase mb-3 border-b border-white/5 pb-2 flex justify-between">
                <span>Telemetry Source</span>
                <span className="text-cyan-500">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <div className="text-[8px] text-zinc-500 uppercase mb-1">Process Latency</div>
                  <div className="text-cyan-400 text-sm">{steps[activeStep].metrics.latency}</div>
                </div>
                <div>
                  <div className="text-[8px] text-zinc-500 uppercase mb-1">Confidence Score</div>
                  <div className="text-green-400 text-sm">{steps[activeStep].metrics.confidence}</div>
                </div>
                <div className="col-span-2 mt-1">
                  <div className="text-[8px] text-zinc-500 uppercase mb-1 flex justify-between">
                    <span>Node Distribution</span>
                    <span>{steps[activeStep].metrics.activeNodes} Active</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      key={`bar-${activeStep}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(steps[activeStep].metrics.activeNodes / 1242) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

    </motion.div>
  );
};

export default About;
