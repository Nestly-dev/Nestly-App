// components/dashboard/CustomerChart.jsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'First-time Visitors', value: 35 },
  { name: 'Returning Customers', value: 45 },
  { name: 'Loyalty Members', value: 20 },
];

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

const CustomerChart = () => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-72">
      <div className="md:col-span-4 flex flex-col justify-center">
        <div className="space-y-4">
          {data.map((entry, index) => (
            <div key={`stat-${index}`} className="flex flex-col">
              <div className="flex items-center mb-1">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm font-medium">{entry.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ 
                      width: `${(entry.value / total) * 100}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="md:col-span-8 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#374151"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Percentage']}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="md:col-span-12 grid grid-cols-3 gap-4 mt-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 font-medium text-sm">New Signups</p>
          <p className="text-2xl font-bold">+124</p>
          <p className="text-xs text-blue-600">Last 7 days</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-700 font-medium text-sm">Retention Rate</p>
          <p className="text-2xl font-bold">68%</p>
          <p className="text-xs text-green-600">+5% from last month</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-700 font-medium text-sm">Avg. Stay Duration</p>
          <p className="text-2xl font-bold">2.8 nights</p>
          <p className="text-xs text-purple-600">Trending upward</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerChart;