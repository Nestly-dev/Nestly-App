// components/dashboard/MediaList.jsx
"use client";

import { useState } from "react";
import { formatDate, formatNumber } from "@/lib/utils";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  Star,
  Download,
  Share,
  ImageIcon,
  Video,
  FilePlus,
  ExternalLink
} from "lucide-react";

// Sample media data
const mediaData = [
  {
    id: 1,
    title: "Hotel Exterior",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?hotel",
    thumbnail: "https://source.unsplash.com/random/800x600/?hotel",
    views: 4500,
    featured: true,
    dateAdded: "2025-03-15",
    category: "Exterior",
    fileSize: "2.4 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 2,
    title: "Lobby Area",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?hotel-lobby",
    thumbnail: "https://source.unsplash.com/random/800x600/?hotel-lobby",
    views: 3200,
    featured: true,
    dateAdded: "2025-03-18",
    category: "Interior",
    fileSize: "1.8 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 3,
    title: "Deluxe Suite",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?hotel-room",
    thumbnail: "https://source.unsplash.com/random/800x600/?hotel-room",
    views: 2800,
    featured: false,
    dateAdded: "2025-03-20",
    category: "Rooms",
    fileSize: "2.1 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 4,
    title: "Swimming Pool",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?swimming-pool",
    thumbnail: "https://source.unsplash.com/random/800x600/?swimming-pool",
    views: 2100,
    featured: true,
    dateAdded: "2025-03-22",
    category: "Amenities",
    fileSize: "1.9 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 5,
    title: "Restaurant",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?restaurant",
    thumbnail: "https://source.unsplash.com/random/800x600/?restaurant",
    views: 1800,
    featured: false,
    dateAdded: "2025-03-25",
    category: "Dining",
    fileSize: "2.2 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 6,
    title: "Hotel Tour",
    type: "video",
    url: "https://example.com/videos/hotel-tour.mp4",
    thumbnail: "https://source.unsplash.com/random/800x600/?hotel-exterior",
    views: 5600,
    featured: true,
    dateAdded: "2025-03-10",
    category: "Tours",
    fileSize: "24 MB",
    duration: "2:45"
  },
  {
    id: 7,
    title: "Gym Facilities",
    type: "photo",
    url: "https://source.unsplash.com/random/800x600/?gym",
    thumbnail: "https://source.unsplash.com/random/800x600/?gym",
    views: 1500,
    featured: false,
    dateAdded: "2025-03-27",
    category: "Amenities",
    fileSize: "1.7 MB",
    dimensions: "2400 x 1600"
  },
  {
    id: 8,
    title: "Room Service",
    type: "video",
    url: "https://example.com/videos/room-service.mp4",
    thumbnail: "https://source.unsplash.com/random/800x600/?room-service",
    views: 2300,
    featured: false,
    dateAdded: "2025-03-30",
    category: "Services",
    fileSize: "18 MB",
    duration: "1:20"
  }
];

const MediaList = ({ type = "all" }) => {
  const [media, setMedia] = useState(mediaData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Filter media based on search term and type
  const filteredMedia = media.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (type === "all") return matchesSearch;
    if (type === "photo") return item.type === "photo" && matchesSearch;
    if (type === "video") return item.type === "video" && matchesSearch;
    if (type === "featured") return item.featured && matchesSearch;
    
    return matchesSearch;
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
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredMedia.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMedia.map(item => item.id));
    }
  };
  
  // Function to get media type badge
  const getMediaTypeBadge = (type) => {
    if (type === "photo") {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Photo</Badge>;
    } else if (type === "video") {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">Video</Badge>;
    }
    return <Badge>{type}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 flex-1">
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedItems.length} selected
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" /> Share
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-600">
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedItems.length === filteredMedia.length && filteredMedia.length > 0}
                  onChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead>Media</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>File Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedia.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleSelection(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={item.thumbnail} alt={item.title} />
                      <AvatarFallback>
                        {item.type === "photo" ? (
                          <ImageIcon className="h-4 w-4" />
                        ) : (
                          <Video className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {item.url}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{getMediaTypeBadge(item.type)}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatDate(item.dateAdded)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 text-muted-foreground mr-1" />
                    {formatNumber(item.views)}
                  </div>
                </TableCell>
                <TableCell>
                  {item.featured ? (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                      <Star className="h-3 w-3 mr-1" /> Featured
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground">
                    <p>{item.fileSize}</p>
                    <p>{item.dimensions || (item.duration && `Duration: ${item.duration}`)}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
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
                        <ExternalLink className="mr-2 h-4 w-4" /> View
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredMedia.length === 0 && (
        <div className="text-center py-8">
          <FilePlus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No media found</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm 
              ? "Try adjusting your search terms" 
              : "Upload some media to get started"}
          </p>
          <Button className="mt-4">
            <FilePlus className="h-4 w-4 mr-2" /> Upload Media
          </Button>
        </div>
      )}
    </div>
  );
};

export default MediaList;