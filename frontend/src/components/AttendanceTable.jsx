
import { Badge } from './Badge';
import { formatTime, getRelativeTime } from '../utils/helpers';
import { SkeletonRow } from './LoadingSpinner';
import { Clock, Award } from 'lucide-react';

export const AttendanceTable = ({ records = [], loading = false }) => {
  if (loading) {
    return (
      <div className="divide-y divide-surfaceLight">
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (!records.length) {
    return (
      <div className="py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-surfaceLight flex items-center justify-center mx-auto mb-4">
          <Clock size={24} className="text-gray-500" />
        </div>
        <p className="text-gray-500 text-sm">No attendance records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surfaceLight">
            <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4">Student</th>
            <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4">Roll No.</th>
            <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4 hidden sm:table-cell">Time</th>
            <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4 hidden md:table-cell">
              <span className="flex items-center gap-1"><Award size={11} /> Confidence</span>
            </th>
            <th className="text-left text-xs text-gray-500 font-medium uppercase tracking-wider py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surfaceLight/50">
          {records.map((rec, i) => (
            <tr
              key={rec.id || i}
              className="hover:bg-surfaceLight/30 transition-colors duration-150 group"
            >
              <td className="py-3.5 px-4">
                <span className="font-medium text-white group-hover:text-primary transition-colors">{rec.name}</span>
              </td>
              <td className="py-3.5 px-4 text-gray-400 font-mono text-xs">{rec.roll}</td>
              <td className="py-3.5 px-4 text-gray-400 hidden sm:table-cell">
                {rec.time ? (
                  <span title={formatTime(rec.time)} className="cursor-default">{getRelativeTime(rec.time)}</span>
                ) : '—'}
              </td>
              <td className="py-3.5 px-4 hidden md:table-cell">
                {rec.confidence > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-surfaceLight rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${rec.confidence >= 90 ? 'bg-emerald-400' : rec.confidence >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${rec.confidence}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${rec.confidence >= 90 ? 'text-emerald-400' : rec.confidence >= 75 ? 'text-amber-400' : 'text-red-400'}`}>
                      {rec.confidence}%
                    </span>
                  </div>
                ) : <span className="text-gray-600">—</span>}
              </td>
              <td className="py-3.5 px-4">
                <Badge status={rec.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
