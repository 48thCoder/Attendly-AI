


export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date)) return '—';
  return date.toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', ...options
  });
};


export const formatTime = (isoStr) => {
  if (!isoStr) return '—';
  const date = new Date(isoStr);
  if (isNaN(date)) return '—';
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};


export const getInitials = (name = '') => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('');
};


export const getAvatarColor = (name = '') => {
  const colors = [
    'from-cyan-500 to-blue-600',
    'from-purple-500 to-pink-600',
    'from-emerald-500 to-teal-600',
    'from-orange-500 to-red-600',
    'from-blue-500 to-indigo-600',
    'from-yellow-500 to-orange-600',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};


export const getAttendanceColor = (pct) => {
  if (pct >= 85) return 'text-emerald-400';
  if (pct >= 75) return 'text-amber-400';
  return 'text-red-400';
};

export const getAttendanceBg = (pct) => {
  if (pct >= 85) return 'bg-emerald-500';
  if (pct >= 75) return 'bg-amber-500';
  return 'bg-red-500';
};


export const getAttendanceStatus = (pct) => {
  if (pct >= 85) return { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' };
  if (pct >= 75) return { label: 'Average', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30' };
  return { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30' };
};


export const downloadCSV = (data, filename = 'export.csv') => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


export const recordsToCSV = (records) => {
  const headers = ['Date', 'Class', 'Present', 'Absent', 'Rate (%)'];
  const rows = records.map((r) => [r.date, r.class, r.present, r.absent, r.rate]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
};


export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);


export const getRelativeTime = (isoStr) => {
  if (!isoStr) return null;
  const diff = Math.floor((Date.now() - new Date(isoStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return formatTime(isoStr);
};
