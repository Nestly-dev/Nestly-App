// app/dashboard/rooms/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BedDouble, 
  Plus, 
  Filter,
  CalendarDays,
  TrendingUp,
  Settings,
  ListFilter
} from "lucide-react";
import RoomsTable from "@/components/dashboard/RoomsTable";
import RoomTypeList from "@/components/dashboard/RoomTypeList";
import RoomPricing from "@/components/dashboard/RoomPricing";

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground">
            Manage your hotel's rooms, types, and availability
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4 text-black" /> <p className="text-black">Add Room</p>
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Room Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-bold">84</p>
              <div className="flex gap-2 flex-wrap">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                  42 Standard
                </Badge>
                <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                  28 Deluxe
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">
                  14 Suite
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Available Today</p>
              <p className="text-2xl font-bold">32</p>
              <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                38% availability
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Average Occupancy</p>
              <p className="text-2xl font-bold">72%</p>
              <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                Last 30 days
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Avg. Rate</p>
              <p className="text-2xl font-bold">$158</p>
              <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                +12% vs. last month
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rooms">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="rooms" className="flex items-center">
              <BedDouble className="h-4 w-4 mr-2" /> All Rooms
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center">
              <ListFilter className="h-4 w-4 mr-2" /> Room Types
            </TabsTrigger>
            <TabsTrigger value="pricing" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" /> Pricing
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <CalendarDays className="h-4 w-4 mr-2" /> Availability
            </Button>
          </div>
        </div>
        
        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Rooms</CardTitle>
              <CardDescription>
                View and manage all your hotel's rooms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoomsTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Types</CardTitle>
              <CardDescription>
                Manage the various room types available in your hotel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoomTypeList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Pricing</CardTitle>
              <CardDescription>
                Set and manage pricing for different room types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RoomPricing />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rates</CardTitle>
            <CardDescription>
              Room occupancy trends over the past month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Standard Room', 'Deluxe Room', 'Family Suite', 'Presidential Suite'].map((room, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{room}</span>
                    <span className="font-medium">{85 - (i * 10)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        i === 0 ? 'bg-blue-500' : 
                        i === 1 ? 'bg-green-500' : 
                        i === 2 ? 'bg-purple-500' : 
                        'bg-amber-500'
                      }`}
                      style={{ width: `${85 - (i * 10)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Highest Demand</p>
                <p className="text-xl font-bold">Standard Room</p>
                <p className="text-xs text-blue-600">85% occupancy rate</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-amber-700 font-medium">Lowest Demand</p>
                <p className="text-xl font-bold">Presidential Suite</p>
                <p className="text-xs text-amber-600">55% occupancy rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Room Type</CardTitle>
            <CardDescription>
              Revenue distribution across different room types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Standard Room', 'Deluxe Room', 'Family Suite', 'Presidential Suite'].map((room, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      i === 0 ? 'bg-blue-500' : 
                      i === 1 ? 'bg-green-500' : 
                      i === 2 ? 'bg-purple-500' : 
                      'bg-amber-500'
                    }`}></div>
                    <span>{room}</span>
                  </div>
                  <div className="font-medium">${(i + 1) * 12500}</div>
                </div>
              ))}
              
              <div className="pt-4 mt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Total Revenue</span>
                  <span className="font-bold">$125,000</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Revenue Share</h3>
              <div className="flex h-4 rounded-full overflow-hidden">
                <div className="bg-blue-500 w-[40%]"></div>
                <div className="bg-green-500 w-[30%]"></div>
                <div className="bg-purple-500 w-[20%]"></div>
                <div className="bg-amber-500 w-[10%]"></div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-black">
                <span>Standard (40%)</span>
                <span>Deluxe (30%)</span>
                <span>Family (20%)</span>
                <span>Pres. (10%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}