
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, RefreshCcw } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <h1 className="text-9xl font-playfair font-black text-primary/10 select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertCircle size={80} className="text-primary animate-pulse-glow" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 space-y-4"
      >
        <h2 className="text-3xl font-playfair font-bold text-white">Digital Void Encountered</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The coordinates you requested do not exist in the Attendly AI database. The requested data may have been relocated or purged.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => navigate('/')}
          className="btn-primary"
        >
          <Home size={18} />
          Back to Terminal
        </button>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary"
        >
          <RefreshCcw size={18} />
          Reboot System
        </button>
      </motion.div>


      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};
