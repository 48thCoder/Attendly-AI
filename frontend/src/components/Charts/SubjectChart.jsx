import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surfaceLight border border-primary/20 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="font-semibold text-white mb-1">{label}</p>
        <p className="text-emerald-400 font-bold">{payload[0].value}% Attendance</p>
      </div>
    );
  }
  return null;
};

export const SubjectChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart 
        data={data} 
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        barCategoryGap="15%"
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" hide />
        <YAxis 
          domain={[0, 100]} 
          tick={{ fill: '#4b5563', fontSize: 10 }} 
          axisLine={false}
          tickLine={false}
          ticks={[0, 25, 50, 75, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Bar dataKey="pct" radius={[10, 10, 0, 0]} barSize={45}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.pct >= 85 ? '#34d399' : entry.pct >= 75 ? '#fbbf24' : '#f87171'} 
              fillOpacity={0.2}
              stroke={entry.pct >= 85 ? '#34d399' : entry.pct >= 75 ? '#fbbf24' : '#f87171'}
              strokeWidth={1}
            />
          ))}
          <LabelList 
            dataKey="name" 
            position="center" 
            angle={-90}
            style={{ 
              fill: '#ffffff', 
              fontSize: '13px', 
              fontWeight: '600', 
              fontFamily: 'Plus Jakarta Sans',
              pointerEvents: 'none',
              textAnchor: 'middle'
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
