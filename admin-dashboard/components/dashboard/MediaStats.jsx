// components/dashboard/MediaStats.jsx
"use client";

import { formatNumber } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, ArrowUpRight } from "lucide-react";

const MediaStats = ({ media = [] }) => {
  // Process media data
  const mediaItems = Array.isArray(media)
    ? media
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 6)
        .map(item => ({
          name: item.title || item.file_name || `Media ${item.id}`,
          type: item.media_type || (item.file_name?.includes('.mp4') || item.file_name?.includes('.mov') ? 'video' : 'photo'),
          views: item.view_count || 0,
          change: "+0%",
        }))
    : [];

  // Generate chart data for last 7 days (mock for now since we don't track daily views)
  const generateChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const totalViews = media.reduce((sum, item) => sum + (item.view_count || 0), 0);
    const avgViews = totalViews / 7;

    return days.map(name => ({
      name,
      views: Math.floor(avgViews * (0.8 + Math.random() * 0.4)),
    }));
  };

  const chartData = generateChartData();

  if (mediaItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No media data available
      </div>
    );
  }
  return (
    <div>
      {/* Mini chart at the top */}
      <div className="h-36 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              contentStyle={{
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`${formatNumber(value)} views`, 'Views']}
            />
            <Bar 
              dataKey="views" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top media items table */}
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Top Media Items</h3>
        <div className="space-y-2">
          {mediaItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center h-10 w-10 rounded-md ${
                  item.type === 'video' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.type === 'video' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 text-muted-foreground mr-1" />
                  <p className="font-medium">{formatNumber(item.views)}</p>
                </div>
                <p className="text-xs text-green-500 flex items-center justify-end">
                  {item.change} <ArrowUpRight className="ml-1 h-3 w-3" />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaStats;