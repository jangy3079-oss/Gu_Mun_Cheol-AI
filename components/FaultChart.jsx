"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#ef4444', '#10b981']; // Red for me, Emerald for other

export default function FaultChart({ data }) {
  if (!data) return null;
  
  const chartData = [
    { name: '본인 과실', value: data.me },
    { name: '상대방 과실', value: data.other },
  ];

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={30}
            outerRadius={50}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
            animationBegin={500}
          >
             {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a', fontWeight: '600' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
