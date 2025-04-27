// components/dashboard/RevenueChart.jsx
"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data for the chart
const data = [
  { name: 'Jan', revenue: 4000, bookings: 24 },
  { name: 'Feb', revenue: 3000, bookings: 18 },
  { name: 'Mar', revenue: 6000, bookings: 38 },
  { name: 'Apr', revenue: 8000, bookings: 45 },
  { name: 'May', revenue: 5500, bookings: 32 },
  { name: 'Jun', revenue: 7500, bookings: 37 },
  { name: 'Jul', revenue: 9800, bookings: 55 },
  { name: 'Aug', revenue: 12000, bookings: 70 },
  { name: 'Sep', revenue: 9300, bookings: 64 },
  { name: 'Oct', revenue: 7800, bookings: 50 },
  { name: 'Nov', revenue: 8700, bookings: 52 },
  { name: 'Dec', revenue: 11300, bookings: 68 },
];

const RevenueChart = () => {
  const [activeMetric, setActiveMetric] = useState('revenue');

  return (
    <div className="h-80">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveMetric('revenue')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeMetric === 'revenue' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Revenue
        </button>
        <button
          onClick={() => setActiveMetric('bookings')}
          className={`px-3 py-1 rounded-full text-sm ${
            activeMetric === 'bookings' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Bookings
        </button>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            formatter={(value) => {
              if (activeMetric === 'revenue') {
                return [`$${value}`, 'Revenue'];
              }
              return [value, 'Bookings'];
            }}
          />
          <Legend />
          {activeMetric === 'revenue' ? (
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={{ strokeWidth: 2 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#10b981"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              dot={{ strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;