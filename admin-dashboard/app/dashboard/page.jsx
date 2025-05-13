// app/dashboard/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  AreaChart,
  ArrowUpRight,
  BadgePercent,
  BedDouble,
  CreditCard,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CustomerChart from "@/components/dashboard/CustomerChart";
import RecentReviews from "@/components/dashboard/RecentReviews";
import MediaStats from "@/components/dashboard/MediaStats";

export default function DashboardPage() {
  // Mock data
  const stats = [
    {
      title: "Total Bookings",
      value: 1247,
      change: "+12.5%",
      icon: <BedDouble className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+8.2%",
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Active Customers",
      value: 573,
      change: "+19.3%",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Media Views",
      value: "12.5K",
      change: "+24.5%",
      icon: <Eye className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-black">
          Welcome back! Here's an overview of your hotel's performance
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
                <div className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center">
                  {stat.change} <ArrowUpRight className="ml-1 h-3 w-3" />
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
          <select className="text-sm border rounded-md p-2">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last year</option>
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
              <RevenueChart />
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
              <CustomerChart />
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
              15 new
            </div>
          </CardHeader>
          <CardContent>
            <RecentReviews />
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
              3.2K views today
            </div>
          </CardHeader>
          <CardContent>
            <MediaStats />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your next 5 reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">John Doe {i + 1}</p>
                      <p className="text-sm text-muted-foreground">May 1{i}, 2025 - May 2{i}, 2025</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(120 * (i + 1))}</p>
                    <p className="text-sm text-muted-foreground">Suite Room</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Rooms</CardTitle>
            <CardDescription>Most booked room types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Deluxe Suite", "Standard Room", "Family Room", "Presidential Suite"].map((room, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{room}</p>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-16 h-2 rounded-full bg-gray-200 mr-2 overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: `${90 - (i * 20)}%` }}
                      ></div>
                    </div>
                    <span className="text-muted-foreground">{90 - (i * 20)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}