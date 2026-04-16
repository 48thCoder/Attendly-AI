
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surfaceLight border border-primary/20 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-playfair text-primary text-xs mb-2">{label}</p>
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-gray-400 capitalize">{p.dataKey}:</span>
            <span className="text-white font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const WeeklyBarChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ paddingTop: '12px', fontSize: '12px', color: '#9ca3af' }}
          iconType="circle"
          iconSize={8}
        />
        <Bar dataKey="present" fill="#00ffe7" radius={[4, 4, 0, 0]} name="Present" fillOpacity={0.85} />
        <Bar dataKey="absent" fill="#f87171" radius={[4, 4, 0, 0]} name="Absent" fillOpacity={0.85} />
      </BarChart>
    </ResponsiveContainer>
  );
};
