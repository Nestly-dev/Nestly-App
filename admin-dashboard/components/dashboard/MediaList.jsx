// components/dashboard/MediaList.jsx
"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Download, 
  Edit, 
  Trash, 
  Eye,
  Image,
  Video,
  File,
  Upload,
  Grid3X3,
  List
} from "lucide-react";

// Sample media data
const mediaData = [
  {
    id: "MED-1234",
    name: "Hotel Lobby",
    type: "image",
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    size: "2.4 MB",
    uploadedAt: "2025-04-20",
    category: "lobby",
    description: "Beautiful hotel lobby with modern design",
    tags: ["lobby", "interior", "modern"]
  },
  {
    id: "MED-1235",
    name: "Deluxe Room",
    type: "image",
    url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    size: "3.1 MB",
    uploadedAt: "2025-04-19",
    category: "rooms",
    description: "Spacious deluxe room with ocean view",
    tags: ["room", "deluxe", "ocean-view"]
  },
  {
    id: "MED-1236",
    name: "Pool Area",
    type: "image",
    url: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&h=300&fit=crop",
    size: "4.2 MB",
    uploadedAt: "2025-04-18",
    category: "amenities",
    description: "Infinity pool overlooking the ocean",
    tags: ["pool", "outdoor", "amenities"]
  },
  {
    id: "MED-1237",
    name: "Restaurant",
    type: "image",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    size: "2.8 MB",
    uploadedAt: "2025-04-17",
    category: "dining",
    description: "Fine dining restaurant with elegant atmosphere",
    tags: ["restaurant", "dining", "elegant"]
  },
  {
    id: "MED-1238",
    name: "Hotel Tour",
    type: "video",
    url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    size: "15.7 MB",
    uploadedAt: "2025-04-16",
    category: "virtual-tour",
    description: "Virtual tour of the entire hotel",
    tags: ["tour", "virtual", "hotel"]
  },
  {
    id: "MED-1239",
    name: "Spa Center",
    type: "image",
    url: "https://images.unsplash.com/photo-1544161512-4ae3b6c0f0b0?w=400&h=300&fit=crop",
    size: "3.5 MB",
    uploadedAt: "2025-04-15",
    category: "spa",
    description: "Luxury spa and wellness center",
    tags: ["spa", "wellness", "luxury"]
  },
  {
    id: "MED-1240",
    name: "Conference Room",
    type: "image",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    size: "2.9 MB",
    uploadedAt: "2025-04-14",
    category: "business",
    description: "Modern conference room for business meetings",
    tags: ["conference", "business", "meeting"]
  },
  {
    id: "MED-1241",
    name: "Hotel Brochure",
    type: "document",
    url: "/documents/hotel-brochure.pdf",
    size: "8.3 MB",
    uploadedAt: "2025-04-13",
    category: "marketing",
    description: "Complete hotel brochure with all amenities",
    tags: ["brochure", "marketing", "pdf"]
  }
];

const MediaList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [media, setMedia] = useState(mediaData);
  const [viewMode, setViewMode] = useState("grid");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filter media based on search term and category filter
  const filteredMedia = media.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = 
      categoryFilter === "all" ||
      categoryFilter === item.category;
    
    return matchesSearch && matchesFilter;
  });

  // Function to get file type icon
  const getFileTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'document':
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Function to get category badge style
  const getCategoryBadge = (category) => {
    const categoryColors = {
      lobby: "bg-blue-100 text-blue-800 border-blue-200",
      rooms: "bg-green-100 text-green-800 border-green-200",
      amenities: "bg-purple-100 text-purple-800 border-purple-200",
      dining: "bg-orange-100 text-orange-800 border-orange-200",
      spa: "bg-pink-100 text-pink-800 border-pink-200",
      business: "bg-gray-100 text-gray-800 border-gray-200",
      marketing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      "virtual-tour": "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    
    return (
      <Badge className={`${categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200"} hover:${categoryColors[category] || "bg-gray-100"}`}>
        {category.replace('-', ' ')}
      </Badge>
    );
  };

  if (viewMode === "grid") {
    return (
      <div>
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <Button 
                variant={categoryFilter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={categoryFilter === "rooms" ? "default" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter("rooms")}
              >
                Rooms
              </Button>
              <Button 
                variant={categoryFilter === "amenities" ? "default" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter("amenities")}
              >
                Amenities
              </Button>
              <Button 
                variant={categoryFilter === "dining" ? "default" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter("dining")}
              >
                Dining
              </Button>
            </div>
            <div className="flex space-x-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                ) : item.type === "video" ? (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <Video className="h-12 w-12 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <File className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
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
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {item.size} • {new Date(item.uploadedAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getFileTypeIcon(item.type)}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {getCategoryBadge(item.category)}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredMedia.length}</span> of{" "}
            <span className="font-medium">{media.length}</span> media files
          </div>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
        <Input
          placeholder="Search media..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <Button 
              variant={categoryFilter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setCategoryFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={categoryFilter === "rooms" ? "default" : "outline"} 
              size="sm"
              onClick={() => setCategoryFilter("rooms")}
            >
              Rooms
            </Button>
            <Button 
              variant={categoryFilter === "amenities" ? "default" : "outline"} 
              size="sm"
              onClick={() => setCategoryFilter("amenities")}
            >
              Amenities
            </Button>
            <Button 
              variant={categoryFilter === "dining" ? "default" : "outline"} 
              size="sm"
              onClick={() => setCategoryFilter("dining")}
            >
              Dining
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredMedia.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : item.type === "video" ? (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <Video className="h-6 w-6 text-gray-400" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <File className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.size} • {new Date(item.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getCategoryBadge(item.category)}
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
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredMedia.length}</span> of{" "}
          <span className="font-medium">{media.length}</span> media files
        </div>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>
    </div>
  );
};

export default MediaList;