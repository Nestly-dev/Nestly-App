// app/dashboard/gallery/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Image as ImageIcon, 
  Video, 
  Grid, 
  List, 
  Plus, 
  Upload, 
  UploadCloud,
  Filter
} from "lucide-react";
import MediaGrid from "@/components/dashboard/MediaGrid";
import MediaList from "@/components/dashboard/MediaList";
import MediaUpload from "@/components/dashboard/MediaUpload";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">
            Manage your hotel's photos and videos
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4 text-black"/> <p className="text-black">Add Media</p>
          </Button>
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" /> Bulk Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Media</p>
              <p className="text-2xl font-bold">247</p>
              <div className="flex gap-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">176 Photos</Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">71 Videos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">125.3K</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">+12.5% this month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Most Viewed</p>
              <p className="text-2xl font-bold">Lobby Tour</p>
              <Badge className="w-fit mt-1 text-black">24.7K views</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Latest Upload</p>
              <p className="text-2xl font-bold">Suite Room</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">2 days ago</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <MediaGrid type="all" />
        </TabsContent>
        
        <TabsContent value="photos" className="mt-6">
          <MediaGrid type="photo" />
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <MediaGrid type="video" />
        </TabsContent>
        
        <TabsContent value="featured" className="mt-6">
          <MediaGrid type="featured" />
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Media Analytics</CardTitle>
          <CardDescription>View engagement data for your media assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Top Performing Media</h3>
              <div className="space-y-4">
                {['Lobby Tour Video', 'Deluxe Suite Photos', 'Swimming Pool Aerial View', 'Restaurant Evening Ambiance'].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 h-10 w-10 rounded-md flex items-center justify-center">
                        {i % 2 === 0 ? <Video className="h-5 w-5 text-blue-500" /> : <ImageIcon className="h-5 w-5 text-green-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{item}</p>
                        <p className="text-xs text-muted-foreground">Uploaded 2 weeks ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{12500 - i * 2100} views</p>
                      <p className="text-xs text-green-500">+{20 - i * 3}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">View Trends by Category</h3>
              <div className="space-y-4">
                {['Room Photos', 'Exterior Views', 'Amenities', 'Virtual Tours'].map((category, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="font-medium">{category}</p>
                    <div className="flex items-center w-64">
                      <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            i === 0 ? 'bg-blue-500' : 
                            i === 1 ? 'bg-green-500' : 
                            i === 2 ? 'bg-purple-500' : 
                            'bg-amber-500'
                          }`}
                          style={{ width: `${85 - i * 15}%` }}
                        ></div>
                      </div>
                      <span className="ml-3 text-sm">{85 - i * 15}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Engagement by Platform</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Website</p>
                    <p className="text-xl font-bold">62%</p>
                    <p className="text-xs text-blue-600">85.2K views</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">Mobile App</p>
                    <p className="text-xl font-bold">38%</p>
                    <p className="text-xs text-green-600">40.1K views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}