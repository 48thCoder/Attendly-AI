
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, trend, color = 'primary', index = 0 }) => {
  const colorMap = {
    primary: { icon: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20', glow: 'hover:shadow-glow' },
    emerald: { icon: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', glow: 'hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]' },
    red: { icon: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', glow: 'hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]' },
    blue: { icon: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', glow: 'hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]' },
    amber: { icon: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', glow: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.2)]' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`stat-card-glow glass-card p-5 ${c.border} ${c.glow} transition-all duration-300 cursor-default relative overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-full -translate-x-8 -translate-y-8 blur-2xl pointer-events-none`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center border ${c.border}`}>
            {Icon && <Icon size={20} className={c.icon} />}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'} bg-${trend.isPositive ? 'emerald' : 'red'}-500/10 px-2 py-1 rounded-full`}>
              {trend.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        <div>
          <p className="text-2xl font-playfair font-bold text-white tracking-wider">{value}</p>
          <p className="text-sm text-gray-400 mt-1">{title}</p>
          {trend?.label && (
            <p className="text-xs text-gray-500 mt-1">{trend.label}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
