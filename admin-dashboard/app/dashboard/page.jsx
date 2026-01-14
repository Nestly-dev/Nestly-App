// app/dashboard/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowUpRight,
  ArrowDownRight,
  BedDouble,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Users,
  Loader2,
} from "lucide-react";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CustomerChart from "@/components/dashboard/CustomerChart";
import RecentReviews from "@/components/dashboard/RecentReviews";
import MediaStats from "@/components/dashboard/MediaStats";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";

export default function DashboardPage() {
  const { hotel } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState(30);

  useEffect(() => {
    if (hotel?.id) {
      loadAnalytics();
    }
  }, [hotel]);

  const loadAnalytics = async () => {
    if (!hotel?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.analytics.getHotelAnalytics(hotel.id);
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const getRecentBookings = () => {
    if (!analytics?.bookings) return [];
    return analytics.bookings
      .filter(b => new Date(b.check_in_date) >= new Date())
      .sort((a, b) => new Date(a.check_in_date) - new Date(b.check_in_date))
      .slice(0, 5);
  };

  const getTopRooms = () => {
    if (!analytics?.bookings || !analytics?.rooms) return [];

    const roomBookings = {};
    analytics.bookings.forEach(booking => {
      if (booking.room_type_id) {
        roomBookings[booking.room_type_id] = (roomBookings[booking.room_type_id] || 0) + 1;
      }
    });

    const totalBookings = Object.values(roomBookings).reduce((sum, count) => sum + count, 0);

    return analytics.rooms
      .map(room => ({
        ...room,
        bookingCount: roomBookings[room.id] || 0,
        percentage: totalBookings > 0 ? ((roomBookings[room.id] || 0) / totalBookings * 100).toFixed(0) : 0
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 4);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1995AD] mx-auto" />
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 px-4 py-2 bg-[#1995AD] text-white rounded-md hover:bg-[#147a8e]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-600">No hotel selected. Please select a hotel from the header.</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Bookings",
      value: analytics?.totalBookings || 0,
      change: "+12.5%",
      icon: <BedDouble className="h-4 w-4 text-muted-foreground" />,
      trending: "up",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(analytics?.totalRevenue || 0),
      change: "+8.2%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      trending: "up",
    },
    {
      title: "Active Customers",
      value: analytics?.activeCustomers || 0,
      change: "+19.3%",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      trending: "up",
    },
    {
      title: "Media Views",
      value: analytics?.mediaViews || 0,
      change: "+24.5%",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />,
      trending: "up",
    },
  ];

  const recentBookings = getRecentBookings();
  const topRooms = getTopRooms();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-black">
          Welcome back! Here's an overview of {hotel.name || 'your hotel'}'s performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    {stat.icon} {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`text-xs font-medium ${stat.trending === 'up' ? 'text-green-500 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full flex items-center`}>
                  {stat.change}
                  {stat.trending === 'up' ? (
                    <ArrowUpRight className="ml-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="ml-1 h-3 w-3" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          <select
            className="text-sm border rounded-md p-2"
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Your hotel's revenue trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart hotelId={hotel?.id} days={timePeriod} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Overview</CardTitle>
              <CardDescription>
                Your hotel's customer analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerChart hotelId={hotel?.id} days={timePeriod} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>
                Latest feedback from your customers
              </CardDescription>
            </div>
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              <MessageSquare className="h-4 w-4 mr-1" />
              {analytics?.totalReviews || 0} total
            </div>
          </CardHeader>
          <CardContent>
            <RecentReviews hotelId={hotel?.id} reviews={analytics?.reviews} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Media Insights</CardTitle>
              <CardDescription>
                View counts across your hotel's media
              </CardDescription>
            </div>
            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              <Eye className="h-4 w-4 mr-1" />
              {analytics?.mediaViews || 0} views
            </div>
          </CardHeader>
          <CardContent>
            <MediaStats media={analytics?.media} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next {recentBookings.length} reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No upcoming bookings
              </div>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking, i) => (
                  <div key={booking.id || i} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">Booking #{booking.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(booking.total_price || 0)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{booking.payment_status || 'pending'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Rooms</CardTitle>
            <CardDescription>Most booked room types</CardDescription>
          </CardHeader>
          <CardContent>
            {topRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No room data available
              </div>
            ) : (
              <div className="space-y-4">
                {topRooms.map((room, i) => (
                  <div key={room.id || i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{room.room_type || `Room ${room.id}`}</p>
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="w-16 h-2 rounded-full bg-gray-200 mr-2 overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${room.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-muted-foreground">{room.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
