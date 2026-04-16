
export const Badge = ({ status }) => {
  if (status === 'present') {
    return (
      <span className="badge-present inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        Present
      </span>
    );
  }
  if (status === 'absent') {
    return (
      <span className="badge-absent inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
        Absent
      </span>
    );
  }
  if (status === 'late') {
    return (
      <span className="badge-late inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
        Late
      </span>
    );
  }
  return <span className="text-xs text-gray-400">—</span>;
};

export const StatusBadge = ({ label, variant = 'default' }) => {
  const variants = {
    default: 'bg-surfaceLight text-gray-300 border border-surfaceLight',
    success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    danger: 'bg-red-500/15 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    primary: 'bg-primary/15 text-primary border border-primary/30',
  };
  return (
    <span className={`text-xs font-medium py-0.5 px-2.5 rounded-full ${variants[variant]}`}>
      {label}
    </span>
  );
};
