// app/dashboard/bookings/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ListFilter, Download, Plus, Loader2, Users, Calendar, XCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { format } from "date-fns";

export default function BookingsPage() {
  const { hotel } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled

  useEffect(() => {
    if (hotel?.id) {
      loadBookings();
    }
  }, [hotel]);

  const loadBookings = async () => {
    if (!hotel?.id) return;

    try {
      setLoading(true);
      const response = await apiClient.bookings.getByHotel(hotel.id);
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status?.toLowerCase() === filter.toLowerCase();
  });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b =>
      new Date(b.check_in_date) >= new Date() && b.status !== 'cancelled'
    ).length,
    currentlyOccupied: bookings.filter(b => {
      const now = new Date();
      return new Date(b.check_in_date) <= now &&
             new Date(b.check_out_date) >= now &&
             b.status === 'confirmed';
    }).length,
    cancellations: bookings.filter(b => b.status === 'cancelled').length
  };

  const totalRevenue = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1995AD] mx-auto" />
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-600 mt-1">
            Manage your hotel's reservations and check-ins
          </p>
        </div>
        <Button className="bg-[#1995AD] hover:bg-[#177a91]">
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-[#1995AD]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[#1995AD]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcoming}</p>
                <p className="text-xs text-gray-500 mt-1">Check-ins ahead</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.currentlyOccupied}</p>
                <p className="text-xs text-gray-500 mt-1">Active stays</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cancellations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancellations}</p>
                <p className="text-xs text-gray-500 mt-1">This period</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-[#1995AD]' : ''}
          >
            All ({bookings.length})
          </Button>
          <Button
            variant={filter === 'confirmed' ? 'default' : 'outline'}
            onClick={() => setFilter('confirmed')}
            className={filter === 'confirmed' ? 'bg-green-600' : ''}
          >
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-yellow-600' : ''}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </Button>
          <Button
            variant={filter === 'cancelled' ? 'default' : 'outline'}
            onClick={() => setFilter('cancelled')}
            className={filter === 'cancelled' ? 'bg-red-600' : ''}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </Button>
        </div>
        <Button variant="outline" onClick={loadBookings}>
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            {filteredBookings.length} booking(s) • Total Revenue: RWF {totalRevenue.toLocaleString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No bookings found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter === 'all'
                  ? 'Your hotel has no bookings yet.'
                  : `No ${filter} bookings at the moment.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">Booking ID</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Guest</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Check-in</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Check-out</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right p-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm text-gray-600">
                          #{booking.id.substring(0, 8)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-[#1995AD] rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Guest #{booking.user_id?.substring(0, 8)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.num_guests || 1} guest(s)
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900">
                          {booking.check_in_date ? format(new Date(booking.check_in_date), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.check_in_date ? format(new Date(booking.check_in_date), 'h:mm a') : ''}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-900">
                          {booking.check_out_date ? format(new Date(booking.check_out_date), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.check_out_date ? format(new Date(booking.check_out_date), 'h:mm a') : ''}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(booking.status)} capitalize`}>
                          {booking.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <p className="font-semibold text-gray-900">
                          RWF {parseFloat(booking.total_price || 0).toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
