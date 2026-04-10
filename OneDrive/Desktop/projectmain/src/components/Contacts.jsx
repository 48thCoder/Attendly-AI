import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const contacts = [
  { id: 'SYS-01', name: 'Dr. Evelyn Vance', role: 'Chief Neural Architect', org: 'Attendly Core', authLevel: 'Omega', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop', ip: '192.168.1.14', latency: '12ms' },
  { id: 'SYS-02', name: 'Marcus Chen', role: 'Head of Edge Computing', org: 'Global Infrastructure', authLevel: 'Delta', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop', ip: '172.64.9.11', latency: '44ms' },
  { id: 'SYS-03', name: 'Sarah Jenkins', role: 'Security Ops Lead', org: 'Obsidian Team', authLevel: 'Sigma', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop', ip: '10.0.0.45', latency: '8ms' },
  { id: 'SYS-04', name: 'Javier Rodriguez', role: 'Biometric Ethicist', org: 'Data Privacy Division', authLevel: 'Gamma', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', ip: '192.168.1.55', latency: '21ms' },
  { id: 'SYS-05', name: 'Aisha Rahman', role: 'Integration Engineer', org: 'API Synergies', authLevel: 'Delta', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1b4492?q=80&w=200&auto=format&fit=crop', ip: '172.64.4.92', latency: '52ms' },
  { id: 'SYS-06', name: 'UNKNOWN PROXY', role: 'System Monitor Proxy', org: 'Automated Node', authLevel: 'Null', isProxy: true, ip: 'UNKNOWN', latency: 'ERR' }
];

const Contacts = () => {
  const [activeContact, setActiveContact] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, scale: 0.95 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, rotateX: 10 },
    show: { opacity: 1, y: 0, rotateX: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="pt-32 pb-32 max-w-7xl mx-auto px-6"
    >
      <div className="flex flex-col mb-12 items-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-on-surface mb-4 font-headline">
          Personnel & <span className="bg-gradient-to-r from-purple-400 to-cyan-500 bg-clip-text text-transparent">Clearance</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mb-4 font-body">
          Authorized personnel directories synced from active edge nodes. Click a node to ping latency metrics.
        </p>
        <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mt-4"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative perspective-grid-container z-10">
        {contacts.map((contact, i) => (
          <motion.div
            key={contact.id}
            variants={cardVariants}
            whileHover={{ y: -10, scale: 1.02 }}
            onHoverStart={() => setActiveContact(contact.id)}
            onHoverEnd={() => setActiveContact(null)}
            className={`ultra-glass rounded-2xl p-1 overflow-hidden group relative origin-center transition-all duration-300 cursor-pointer ${contact.isProxy ? 'border-rose-500/40 shadow-[0_10px_40px_rgba(244,63,94,0.15)]' : 'border-white/10 shadow-[0_10px_40px_rgba(34,211,238,0.05)]'}`}
            style={{ perspective: "1000px" }}
          >
            {/* Hover light ripple effect */}
            <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-400/20 to-transparent -translate-x-[150%] skew-x-[-30deg] ${activeContact === contact.id ? 'translate-x-[150%]' : ''} transition-transform duration-700 pointer-events-none z-20`}></div>
            
            <div className={`bg-[#141313]/90 backdrop-blur-3xl h-full rounded-xl p-6 relative ${contact.isProxy ? 'group-hover:bg-rose-900/10' : 'group-hover:bg-cyan-900/10'} transition-colors duration-500`}>
              
              {/* ID Badge Header */}
              <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${contact.isProxy ? 'bg-rose-500 animate-ping' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`}></div>
                   <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500">NET: {contact.id}</span>
                 </div>
                 <div className={`px-2 py-0.5 rounded flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold border ${contact.isProxy ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' : 'text-purple-400 border-purple-400/30 bg-purple-400/10'}`}>
                   {contact.isProxy ? <span className="material-symbols-outlined text-[10px]">gpp_bad</span> : <span className="material-symbols-outlined text-[10px]">admin_panel_settings</span>}
                   {contact.authLevel}
                 </div>
              </div>
              
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                   <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-800 relative z-10 group-hover:border-cyan-500/50 transition-colors duration-300">
                     {contact.isProxy ? (
                       <div className="w-full h-full bg-rose-900/40 flex items-center justify-center">
                         <span className="material-symbols-outlined text-rose-500 text-3xl flicker-anim">warning</span>
                       </div>
                     ) : (
                       <img src={contact.img} alt={contact.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                     )}
                   </div>
                   {/* Scanning ring on hover */}
                   <div className="absolute inset-[-4px] rounded-full border border-cyan-400/0 group-hover:border-cyan-400/40 group-hover:animate-spin-slow transition-colors duration-300 z-0 border-t-cyan-400" style={{ animationDuration: '3s' }}></div>
                </div>

                <div className="flex-1">
                  <h3 className={`font-bold font-headline text-lg tracking-tight mb-1 ${contact.isProxy ? 'text-rose-400 shadow-rose-400/50' : 'text-on-surface'}`}>
                    {contact.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-1">{contact.role}</p>
                  <p className="text-[10px] text-cyan-500/70 font-mono flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">account_tree</span>
                    {contact.org}
                  </p>
                </div>
              </div>

              {/* Expansion Details on Hover */}
              <AnimatePresence>
                {activeContact === contact.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2"
                  >
                    <div className="bg-black/40 rounded p-2 border border-white/5">
                      <p className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Ping Latency</p>
                      <p className={`text-[10px] font-mono font-bold ${contact.isProxy ? 'text-rose-400' : 'text-green-400'}`}>{contact.latency}</p>
                    </div>
                    <div className="bg-black/40 rounded p-2 border border-white/5">
                      <p className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase mb-1">Assigned Node</p>
                      <p className="text-[10px] text-zinc-300 font-mono font-bold">{contact.ip}</p>
                    </div>
                    <button className={`col-span-2 mt-2 py-1.5 rounded text-[9px] font-bold tracking-widest uppercase border transition-colors ${contact.isProxy ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/30' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'}`}>
                      {contact.isProxy ? 'Initiate Trace' : 'Open Comm Link'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Holographic scanning overlay lines */}
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 right-8 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Contacts;
