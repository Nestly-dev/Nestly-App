// app/dashboard/bookings/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingsTable from "@/components/dashboard/BookingsTable";
import BookingCalendar from "@/components/dashboard/BookingCalendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ListFilter, Download, Plus } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your hotel's reservations and check-ins
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Booking
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold">1,247</p>
              <Badge className="w-fit mt-1 text-black" variant="outline">Apr 2020</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Upcoming Check-ins</p>
              <p className="text-2xl font-bold">32</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">Today</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Currently Occupied</p>
              <p className="text-2xl font-bold">85%</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">+12% this week</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Cancellations</p>
              <p className="text-2xl font-bold">8</p>
              <Badge className="w-fit mt-1 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">This month</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline">
            <ListFilter className="h-4 w-4 mr-2" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="text-sm">
            Today
          </Button>
          <Button variant="outline" className="text-sm">
            This Week
          </Button>
          <Button variant="outline" className="text-sm">
            This Month
          </Button>
          <Button variant="outline" className="text-sm">
            Custom
          </Button>
        </div>
      </div>

      <Tabs defaultValue="table">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="table" className="flex items-center">
              <ListFilter className="h-4 w-4 mr-2" /> List View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" /> Calendar View
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage all your hotel's reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingsTable />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Calendar</CardTitle>
              <CardDescription>
                Visual representation of your hotel's reservations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingCalendar />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}