// components/dashboard/MediaGrid.jsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Eye, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Download, 
  Star, 
  Share,
  Image as ImageIcon,
  Play,
  Clock
} from "lucide-react";
import { formatNumber, formatDate } from "@/lib/utils";

// Sample media data
const mediaItems = [
  {
    id: 1,
    title: "Hotel Exterior",
    type: "photo",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    views: 12500,
    featured: true,
    dateAdded: "2025-03-15",
    category: "Exterior"
  },
  {
    id: 2,
    title: "Lobby Area",
    type: "photo",
    url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
    thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400",
    views: 9800,
    featured: true,
    dateAdded: "2025-03-18",
    category: "Interior"
  },
  {
    id: 3,
    title: "Deluxe Suite",
    type: "photo",
    url: "https://images.unsplash.com/photo-1600585152915-d2c5a6e50c62",
    thumbnail: "https://images.unsplash.com/photo-1600585152915-d2c5a6e50c62?w=400",
    views: 8500,
    featured: false,
    dateAdded: "2025-03-20",
    category: "Rooms"
  },
  {
    id: 4,
    title: "Swimming Pool",
    type: "photo",
    url: "https://images.unsplash.com/photo-1576675783975-8cd2f8d8a1a6",
    thumbnail: "https://images.unsplash.com/photo-1576675783975-8cd2f8d8a1a6?w=400",
    views: 7200,
    featured: true,
    dateAdded: "2025-03-22",
    category: "Amenities"
  },
  {
    id: 5,
    title: "Restaurant",
    type: "photo",
    url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
    thumbnail: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=400",
    views: 6800,
    featured: false,
    dateAdded: "2025-03-25",
    category: "Dining"
  },
  {
    id: 6,
    title: "Hotel Tour",
    type: "video",
    url: "https://cdn.example.com/videos/hotel-tour.mp4",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    views: 15400,
    featured: true,
    dateAdded: "2025-03-10",
    category: "Tours",
    duration: "2:45"
  },
  {
    id: 7,
    title: "Gym Facilities",
    type: "photo",
    url: "https://images.unsplash.com/photo-1599058917212-d750089bc07e",
    thumbnail: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=400",
    views: 4300,
    featured: false,
    dateAdded: "2025-03-27",
    category: "Amenities"
  },
  {
    id: 8,
    title: "Room Service",
    type: "video",
    url: "https://cdn.example.com/videos/room-service.mp4",
    thumbnail: "https://images.unsplash.com/photo-1631049463912-c0219e292c41?w=400",
    views: 8900,
    featured: false,
    dateAdded: "2025-03-30",
    category: "Services",
    duration: "1:20"
  },
  {
    id: 9,
    title: "Spa Experience",
    type: "video",
    url: "https://cdn.example.com/videos/spa-experience.mp4",
    thumbnail: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400",
    views: 7600,
    featured: true,
    dateAdded: "2025-04-02",
    category: "Amenities",
    duration: "3:15"
  },
  {
    id: 10,
    title: "Conference Room",
    type: "photo",
    url: "https://images.unsplash.com/photo-1573164574233-cb89e39749b4",
    thumbnail: "https://images.unsplash.com/photo-1573164574233-cb89e39749b4?w=400",
    views: 3200,
    featured: false,
    dateAdded: "2025-04-05",
    category: "Business"
  },
  {
    id: 11,
    title: "Wedding Venue",
    type: "photo",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    thumbnail: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
    views: 9100,
    featured: true,
    dateAdded: "2025-04-08",
    category: "Events"
  },
  {
    id: 12,
    title: "Bar & Lounge",
    type: "photo",
    url: "https://images.unsplash.com/photo-1578894388890-a538ba94202a",
    thumbnail: "https://images.unsplash.com/photo-1578894388890-a538ba94202a?w=400",
    views: 5400,
    featured: false,
    dateAdded: "2025-04-10",
    category: "Dining"
  }
];

const MediaGrid = ({ type = "all" }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Filter media items based on type
  const filteredItems = mediaItems.filter(item => {
    if (type === "all") return true;
    if (type === "photo") return item.type === "photo";
    if (type === "video") return item.type === "video";
    if (type === "featured") return item.featured;
    return true;
  });
  
  // Toggle item selection
  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  // Toggle all items selection
  const toggleAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  return (
    <div>
      {/* Selection controls */}
      {selectedItems.length > 0 && (
        <div className="flex justify-between items-center mb-4 p-2 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <Checkbox 
              id="select-all" 
              checked={selectedItems.length === filteredItems.length}
              onCheckedChange={toggleAll}
              className="mr-2"
            />
            <label htmlFor="select-all" className="text-sm font-medium">
              {selectedItems.length} selected
            </label>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      )}
      
      {/* Grid of media items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              {/* Checkbox for selection */}
              <div className="absolute top-2 left-2 z-10">
                <Checkbox 
                  checked={selectedItems.includes(item.id)} 
                  onCheckedChange={() => toggleSelection(item.id)}
                  className="h-5 w-5 bg-white/90 backdrop-blur-sm"
                />
              </div>
              
              {/* Media type indicator */}
              <div className="absolute top-2 right-2 z-10">
                {item.type === "video" ? (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">
                    <Play className="h-3 w-3 mr-1" /> Video
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">
                    <ImageIcon className="h-3 w-3 mr-1" /> Photo
                  </Badge>
                )}
              </div>
              
              {/* Featured indicator */}
              {item.featured && (
                <div className="absolute bottom-2 left-2 z-10">
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                    <Star className="h-3 w-3 mr-1" /> Featured
                  </Badge>
                </div>
              )}
              
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Video duration */}
                {item.type === "video" && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center">
                    <Clock className="h-3 w-3 mr-1" /> {item.duration}
                  </div>
                )}
              </div>
            </div>
            
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium truncate">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.category} • {formatDate(item.dateAdded)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Share className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    {item.featured ? (
                      <DropdownMenuItem className="cursor-pointer">
                        <Star className="mr-2 h-4 w-4" /> Remove from Featured
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem className="cursor-pointer">
                        <Star className="mr-2 h-4 w-4" /> Add to Featured
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 cursor-pointer">
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Views count */}
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" /> {formatNumber(item.views)} views
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            {type === "photo" ? (
              <ImageIcon className="h-6 w-6 text-gray-500" />
            ) : type === "video" ? (
              <Play className="h-6 w-6 text-gray-500" />
            ) : (
              <Folder className="h-6 w-6 text-gray-500" />
            )}
          </div>
          <h3 className="text-lg font-medium">No {type} media found</h3>
          <p className="text-muted-foreground mt-1">
            {type === "photo" 
              ? "Upload some photos to get started" 
              : type === "video" 
                ? "Upload some videos to get started"
                : type === "featured"
                  ? "Mark media as featured to see it here"
                  : "Upload some media to get started"
            }
          </p>
          <Button className="mt-4">
            <Plus className="h-4 w-4 mr-2" /> Upload Media
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaGrid;