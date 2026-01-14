// components/dashboard/RevenueChart.jsx
"use client";

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { apiClient } from '@/lib/apiClient';
import { Loader2 } from 'lucide-react';

const RevenueChart = ({ hotelId, days = 30 }) => {
  const [activeMetric, setActiveMetric] = useState('revenue');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelId) {
      loadTrends();
    }
  }, [hotelId, days]);

  const loadTrends = async () => {
    try {
      setLoading(true);
      const trends = await apiClient.analytics.getBookingTrends(hotelId, days);

      const formattedData = trends.map(trend => ({
        name: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: trend.revenue,
        bookings: trend.bookings,
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error loading revenue trends:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1995AD]" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        No revenue data available for this period
      </div>
    );
  }

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