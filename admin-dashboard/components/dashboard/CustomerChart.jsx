// components/dashboard/CustomerChart.jsx
"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { apiClient } from '@/lib/apiClient';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

const CustomerChart = ({ hotelId, days = 30 }) => {
  const [data, setData] = useState([
    { name: 'First-time Visitors', value: 35 },
    { name: 'Returning Customers', value: 45 },
    { name: 'Loyalty Members', value: 20 },
  ]);
  const [stats, setStats] = useState({
    newSignups: 0,
    retentionRate: 0,
    avgStayDuration: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hotelId) {
      loadCustomerData();
    }
  }, [hotelId, days]);

  const loadCustomerData = async () => {
    try {
      setLoading(true);
      const bookings = await apiClient.bookings.getByHotel(hotelId);

      if (Array.isArray(bookings) && bookings.length > 0) {
        // Calculate customer stats
        const userBookingCounts = {};
        let totalNights = 0;

        bookings.forEach(booking => {
          userBookingCounts[booking.user_id] = (userBookingCounts[booking.user_id] || 0) + 1;

          if (booking.check_in_date && booking.check_out_date) {
            const checkIn = new Date(booking.check_in_date);
            const checkOut = new Date(booking.check_out_date);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            totalNights += nights;
          }
        });

        const firstTime = Object.values(userBookingCounts).filter(count => count === 1).length;
        const returning = Object.values(userBookingCounts).filter(count => count >= 2 && count < 5).length;
        const loyalty = Object.values(userBookingCounts).filter(count => count >= 5).length;
        const total = firstTime + returning + loyalty;

        if (total > 0) {
          setData([
            { name: 'First-time Visitors', value: Math.round((firstTime / total) * 100) },
            { name: 'Returning Customers', value: Math.round((returning / total) * 100) },
            { name: 'Loyalty Members', value: Math.round((loyalty / total) * 100) },
          ]);
        }

        // Calculate stats
        const recentBookings = bookings.filter(b => {
          const createdAt = new Date(b.created_at);
          const daysAgo = new Date();
          daysAgo.setDate(daysAgo.getDate() - 7);
          return createdAt >= daysAgo;
        });

        setStats({
          newSignups: new Set(recentBookings.map(b => b.user_id)).size,
          retentionRate: total > 0 ? Math.round(((returning + loyalty) / total) * 100) : 0,
          avgStayDuration: bookings.length > 0 ? (totalNights / bookings.length).toFixed(1) : 0,
        });
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1995AD]" />
      </div>
    );
  }

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
          <p className="text-blue-700 font-medium text-sm">New Customers</p>
          <p className="text-2xl font-bold">+{stats.newSignups}</p>
          <p className="text-xs text-blue-600">Last 7 days</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-green-700 font-medium text-sm">Retention Rate</p>
          <p className="text-2xl font-bold">{stats.retentionRate}%</p>
          <p className="text-xs text-green-600">Returning + Loyalty</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-700 font-medium text-sm">Avg. Stay Duration</p>
          <p className="text-2xl font-bold">{stats.avgStayDuration} nights</p>
          <p className="text-xs text-purple-600">Per booking</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerChart;