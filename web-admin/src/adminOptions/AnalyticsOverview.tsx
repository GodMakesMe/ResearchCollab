import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const data = [
  { name: 'Projects', value: 56 },
  { name: 'Faculty', value: 37 },
  { name: 'Students', value: 124 },
];

const COLORS = ['#0f6f6f', '#4DB6AC', '#B2DFDB'];

const renderCustomizedLabel = ({
                                 cx,
                                 cy,
                                 midAngle,
                                 innerRadius,
                                 outerRadius,
                                 percent,
                                 index,
                               }: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
      {data[index].name} {(percent * 100).toFixed(0)}%
    </text>
  );
};

const AnalyticsOverview: React.FC = () => {
  return (
    <div style={{ padding: '1.5rem', fontFamily: 'Inter, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem', color: '#0f6f6f', fontSize: '1.8rem', fontWeight: 600 }}>
        Analytics Overview
      </h3>
      <p style={{ marginBottom: '2rem', color: '#555' }}>
        Visual representation of key research-related metrics at a glance.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Pie Chart Container */}
        <div
          style={{
            flex: '1 1 300px',
            backgroundColor: '#e0f2f1',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#0f6f6f"
                dataKey="value"
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart Container */}
        <div
          style={{
            flex: '1 1 300px',
            backgroundColor: '#e0f2f1',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#0f6f6f" />
              <YAxis stroke="#0f6f6f" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" fill="#0f6f6f">
                {data.map((entry, index) => (
                  <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
