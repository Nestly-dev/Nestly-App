// components/dashboard/RoomTypeList.jsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  BedDouble,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Waves,
  Utensils,
  Bath,
  Users,
  Image as ImageIcon,
  Copy
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample room types data
const roomTypesData = [
  {
    id: 1,
    name: "Standard Room",
    description: "A comfortable room with all the essential amenities for a pleasant stay.",
    basePrice: 120,
    maxOccupancy: 2,
    size: 25, // in square meters
    bedType: "Queen",
    totalRooms: 42,
    availableRooms: 18,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Private Bathroom", "Hair Dryer"],
    images: ["https://source.unsplash.com/random/800x600/?hotel-room-standard"],
    lastUpdated: "2025-03-15"
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "A spacious room with premium amenities and a beautiful view of the surroundings.",
    basePrice: 180,
    maxOccupancy: 2,
    size: 35, // in square meters
    bedType: "King",
    totalRooms: 28,
    availableRooms: 10,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Coffee Maker", "Private Bathroom", "Hair Dryer"],
    images: ["https://source.unsplash.com/random/800x600/?hotel-room-deluxe"],
    lastUpdated: "2025-03-18"
  },
  {
    id: 3,
    name: "Family Suite",
    description: "A perfect choice for families, with separate sleeping areas and a kitchenette.",
    basePrice: 250,
    maxOccupancy: 4,
    size: 50, // in square meters
    bedType: "King + Twin",
    totalRooms: 14,
    availableRooms: 4,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Kitchenette", "Private Bathroom", "Hair Dryer", "Sofa Bed", "Dining Area"],
    images: ["https://source.unsplash.com/random/800x600/?hotel-suite-family"],
    lastUpdated: "2025-03-20"
  },
  {
    id: 4,
    name: "Presidential Suite",
    description: "Our most luxurious accommodation with expansive space, premium amenities, and breathtaking views.",
    basePrice: 500,
    maxOccupancy: 2,
    size: 75, // in square meters
    bedType: "King",
    totalRooms: 4,
    availableRooms: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Kitchenette", "Private Bathroom", "Hair Dryer", "Private Balcony", "Jacuzzi", "Dining Area", "Living Room", "Premium Toiletries"],
    images: ["https://source.unsplash.com/random/800x600/?hotel-suite-presidential"],
    lastUpdated: "2025-03-25"
  }
];

const RoomTypeList = () => {
  const [roomTypes, setRoomTypes] = useState(roomTypesData);
  const [expandedType, setExpandedType] = useState(null);

  // Map of amenity names to icons
  const amenityIcons = {
    "Wi-Fi": <Wifi className="h-4 w-4" />,
    "TV": <Tv className="h-4 w-4" />,
    "Air Conditioning": <Wind className="h-4 w-4" />,
    "Mini Bar": <Coffee className="h-4 w-4" />,
    "Ocean View": <Waves className="h-4 w-4" />,
    "Kitchenette": <Utensils className="h-4 w-4" />,
    "Private Bathroom": <Bath className="h-4 w-4" />,
  };

  // Toggle expanded view for a room type
  const toggleExpand = (id) => {
    if (expandedType === id) {
      setExpandedType(null);
    } else {
      setExpandedType(id);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Room Type
        </Button>
      </div>
      
      {roomTypes.map((roomType) => (
        <Card key={roomType.id} className={expandedType === roomType.id ? "border-blue-300" : ""}>
          <CardContent className="p-0">
            {/* Header Section */}
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(roomType.id)}
            >
              <div className="flex items-center">
                <BedDouble className="h-5 w-5 mr-2 text-blue-600" />
                <div>
                  <h3 className="font-medium text-lg">{roomType.name}</h3>
                  <p className="text-sm text-muted-foreground">{roomType.bedType} • {roomType.size} m²</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(roomType.basePrice)}<span className="text-xs text-muted-foreground">/night</span></p>
                  <p className="text-xs text-muted-foreground">Max: {roomType.maxOccupancy} guests</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    {expandedType === roomType.id ? 
                      <ChevronUp className="h-4 w-4" /> : 
                      <ChevronDown className="h-4 w-4" />
                    }
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Room Type
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            
            {/* Expanded Details Section */}
            {expandedType === roomType.id && (
              <div className="border-t p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Description & Stats */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{roomType.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Room Stats</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <BedDouble className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">{roomType.bedType}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">{roomType.maxOccupancy} guests</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Availability</h4>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800">
                            {roomType.availableRooms} Available
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            of {roomType.totalRooms} total
                          </span>
                        </div>
                        <div>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Middle Column - Amenities */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {roomType.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center">
                          {amenityIcons[amenity] || <div className="w-4 h-4 mr-2" />}
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Right Column - Image */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Preview Image</h4>
                    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100">
                      {roomType.images && roomType.images.length > 0 ? (
                        <img 
                          src={roomType.images[0]} 
                          alt={roomType.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Last updated: {roomType.lastUpdated}
                      </span>
                      <Button variant="outline" size="sm">
                        Manage Images
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-end space-x-2">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button>
                    View Rooms
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoomTypeList;