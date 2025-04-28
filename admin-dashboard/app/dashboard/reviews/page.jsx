// app/dashboard/reviews/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Star, 
  Filter, 
  Plus,
  Reply,
  ThumbsUp,
  Calendar,
  LineChart
} from "lucide-react";
import ReviewsTable from "@/components/dashboard/ReviewsTable";
import ReviewAnalytics from "@/components/dashboard/ReviewsAnalytics";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Reviews</h1>
          <p className="text-muted-foreground">
            Manage and respond to guest feedback
          </p>
        </div>
        <Button>
          <ThumbsUp className="mr-2 h-4 w-4" /> Respond to All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold">4.7</p>
                <div className="ml-2 flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4.7 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                </div>
              </div>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">+0.2 from last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-bold">342</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">+28 new this month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold">92%</p>
              <Badge className="w-fit mt-1 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">24 waiting for response</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Sentiment Analysis</p>
              <p className="text-2xl font-bold">Positive</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">78% positive feedback</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending Response</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" /> Date Range
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Reviews</CardTitle>
              <CardDescription>Browse and manage customer feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Responses</CardTitle>
              <CardDescription>Reviews waiting for your response</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsTable filterBy="pending" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responded" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Responded Reviews</CardTitle>
              <CardDescription>Reviews you've already responded to</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsTable filterBy="responded" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="flagged" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Reviews</CardTitle>
              <CardDescription>Reviews marked for special attention</CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewsTable filterBy="flagged" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Review Analytics</CardTitle>
          <CardDescription>Trends and insights from your customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewAnalytics />
        </CardContent>
      </Card>
    </div>
  );
}