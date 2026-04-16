
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surfaceLight border border-primary/20 rounded-xl px-3 py-2 shadow-xl text-xs">
        <span className="text-white font-semibold">{payload[0].name}: {payload[0].value}</span>
      </div>
    );
  }
  return null;
};

export const TodayDonutChart = ({ present = 0, absent = 0 }) => {
  const total = present + absent;
  const pct = total > 0 ? Math.round((present / total) * 100) : 0;
  const data = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ];
  const COLORS = ['#00ffe7', '#f87171'];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={76}
              paddingAngle={4}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} fillOpacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-3xl font-playfair font-bold text-white leading-none">{pct}%</p>
          <p className="text-xs text-gray-400 mt-1">Present</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-3">
        {data.map((entry, i) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
            <span className="text-gray-400">{entry.name}:</span>
            <span className="text-white font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
