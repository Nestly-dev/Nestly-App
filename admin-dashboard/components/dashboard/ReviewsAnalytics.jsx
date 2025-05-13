// components/dashboard/ReviewAnalytics.jsx
"use client";

import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// Sample data for the charts
const ratingDistribution = [
  { rating: '5 Stars', count: 156 },
  { rating: '4 Stars', count: 98 },
  { rating: '3 Stars', count: 53 },
  { rating: '2 Stars', count: 24 },
  { rating: '1 Star', count: 11 },
];

const reviewTrends = [
  { month: 'Jan', count: 24, avgRating: 4.2 },
  { month: 'Feb', count: 28, avgRating: 4.3 },
  { month: 'Mar', count: 32, avgRating: 4.4 },
  { month: 'Apr', count: 38, avgRating: 4.7 },
  { month: 'May', count: 42, avgRating: 4.6 },
  { month: 'Jun', count: 48, avgRating: 4.8 },
];

const categoryScores = [
  { category: 'Cleanliness', score: 4.8 },
  { category: 'Service', score: 4.9 },
  { category: 'Amenities', score: 4.6 },
  { category: 'Location', score: 4.7 },
  { category: 'Value', score: 4.2 },
  { category: 'Food', score: 4.5 },
];

const ReviewAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={ratingDistribution}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="rating" type="category" />
                  <Tooltip 
                    formatter={(value) => [`${value} reviews`, 'Count']}
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#FFD700" 
                    radius={[0, 4, 4, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Review Trends</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reviewTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[1, 5]} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }}
                    name="Reviews Count"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="avgRating" 
                    stroke="#10b981" 
                    name="Avg Rating"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Category Scores</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryScores}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 5]} />
                <Tooltip 
                  formatter={(value) => [`${value} / 5`, 'Score']}
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar 
                  dataKey="score" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                  barSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium mb-2">Common Positive Keywords</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {["clean", "friendly", "helpful", "comfortable", "spacious", "location", "service", "breakfast", "view", "staff"].map((keyword) => (
                <div key={keyword} className="px-3 py-1 bg-green-300 text-green-800 rounded-full text-sm">
                  {keyword}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium mb-2">Common Negative Keywords</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {["noise", "slow", "expensive", "wifi", "bathroom", "small", "outdated", "parking", "maintenance", "wait"].map((keyword) => (
                <div key={keyword} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {keyword}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-medium mb-2">Review Sources</h3>
            <div className="space-y-4 mt-4">
              {[
                { source: "Direct Website", percentage: 45 },
                { source: "Booking.com", percentage: 30 },
                { source: "Expedia", percentage: 15 },
                { source: "TripAdvisor", percentage: 10 }
              ].map((item) => (
                <div key={item.source} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-black">{item.source}</span>
                    <span className="text-sm font-medium text-black">{item.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReviewAnalytics;