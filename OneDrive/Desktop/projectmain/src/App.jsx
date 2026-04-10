import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './components/Home';
import About from './components/About';
import Contacts from './components/Contacts';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [anomalyDetected] = useState(false);

  // Render active view
  const renderView = () => {
    switch(currentView) {
      case 'home':
        return <Home anomalyDetected={anomalyDetected} key="home" />;
      case 'about':
        return <About key="about" />;
      case 'contacts':
        return <Contacts key="contacts" />;
      default:
        return <Home anomalyDetected={anomalyDetected} key="home" />;
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen">
      <div className="fixed inset-0 grain-texture z-[100]"></div>

      {/* TopAppBar */}
      <header className={`fixed top-0 w-full z-50 transition-colors duration-500 ${anomalyDetected ? 'bg-rose-900/60 shadow-[0_4px_24px_0_rgba(244,63,94,0.15)]' : 'bg-[#141313]/60 shadow-[0_4px_24px_0_rgba(34,211,238,0.06)]'} backdrop-blur-xl saturate-150`}>
        <nav className="flex justify-between items-center px-6 h-16 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <span className={`material-symbols-outlined ${anomalyDetected ? 'text-rose-400' : 'text-cyan-400'}`} style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>android_fingerprint</span>
            <span className={`text-xl font-bold tracking-tighter bg-gradient-to-r ${anomalyDetected ? 'from-rose-400 to-red-500' : 'from-cyan-400 to-purple-500'} bg-clip-text text-transparent font-headline`}>
              Attendly AI
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <button onClick={() => setCurrentView('home')} className={`${currentView === 'home' ? 'text-cyan-400 shadow-[0_4px_0_-2px_#22d3ee]' : 'text-zinc-500 hover:text-cyan-300'} font-bold font-headline tracking-tighter text-sm uppercase transition-all duration-300`}>Orb</button>
            <button onClick={() => setCurrentView('about')} className={`${currentView === 'about' ? 'text-cyan-400 shadow-[0_4px_0_-2px_#22d3ee]' : 'text-zinc-500 hover:text-cyan-300'} font-bold font-headline tracking-tighter text-sm uppercase transition-all duration-300`}>Pipeline</button>
            <button onClick={() => setCurrentView('contacts')} className={`${currentView === 'contacts' ? 'text-cyan-400 shadow-[0_4px_0_-2px_#22d3ee]' : 'text-zinc-500 hover:text-cyan-300'} font-bold font-headline tracking-tighter text-sm uppercase transition-all duration-300`}>Contacts</button>
            <button className="text-zinc-500 hover:text-cyan-300 transition-colors duration-300 text-sm font-headline tracking-tighter uppercase">API</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 hover:border-cyan-400 cursor-pointer transition-colors">
              <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDqdxhzFWNKotnPVY0Z4tQbzCEY-l0NcfchUhmXQfDKzMRSL5dEUoQsLwSlJdFlkkChtunQPiYIXswq_RaOW9QY7xjzBb8ZX2QppVeLCZ5bbeS7XK0OMsa3RB5WgmW1U3erOD2yHEZvTzpjiQJT_BBEM3IAWcorkLxCF_M6HFFvBeqja77IWmJHeoslPvdpY1VicqQcE33BD3Qak0vVdoju32L7KhvfgmVoHFHjkIy1oTT6Kwc7JUvHdZeTu48I2UqhtAa8Hrmizg" />
            </div>
          </div>
        </nav>
      </header>

      <main className="min-h-screen">
        <AnimatePresence mode="wait">
          {renderView()}
        </AnimatePresence>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 items-center ultra-glass rounded-2xl px-2 py-2 shadow-[0_12px_48px_rgba(0,0,0,0.6)]">
        <button 
          onClick={() => setCurrentView('home')} 
          className={`flex flex-col items-center justify-center rounded-xl px-5 py-2 active:scale-90 transition-all duration-300 ${currentView === 'home' ? 'bg-gradient-to-br from-cyan-500/30 to-purple-500/30 text-cyan-400 ring-1 ring-cyan-500/40' : 'text-zinc-500 hover:bg-white/10 hover:text-cyan-200'}`}>
          <span className="material-symbols-outlined mb-1 text-base">center_focus_strong</span>
          <span className="font-['Inter'] text-[9px] font-bold tracking-widest uppercase">Orb</span>
        </button>
        <button 
          onClick={() => setCurrentView('about')} 
          className={`flex flex-col items-center justify-center rounded-xl px-5 py-2 active:scale-90 transition-all duration-300 ${currentView === 'about' ? 'bg-gradient-to-br from-cyan-500/30 to-purple-500/30 text-cyan-400 ring-1 ring-cyan-500/40' : 'text-zinc-500 hover:bg-white/10 hover:text-cyan-200'}`}>
          <span className="material-symbols-outlined mb-1 text-base">account_tree</span>
          <span className="font-['Inter'] text-[9px] font-bold tracking-widest uppercase">Pipeline</span>
        </button>
        <button 
          onClick={() => setCurrentView('contacts')} 
          className={`flex flex-col items-center justify-center rounded-xl px-5 py-2 active:scale-90 transition-all duration-300 ${currentView === 'contacts' ? 'bg-gradient-to-br from-cyan-500/30 to-purple-500/30 text-cyan-400 ring-1 ring-cyan-500/40' : 'text-zinc-500 hover:bg-white/10 hover:text-cyan-200'}`}>
          <span className="material-symbols-outlined mb-1 text-base">shield_person</span>
          <span className="font-['Inter'] text-[9px] font-bold tracking-widest uppercase">Contacts</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
