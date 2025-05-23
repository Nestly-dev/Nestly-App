// components/dashboard/RoomsTable.jsx
"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash, 
  BedDouble,
  Users,
  Check,
  X
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Sample rooms data
const roomsData = [
  {
    id: "101",
    type: "Standard Room",
    status: "available",
    floor: 1,
    price: 120,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    lastCleaned: "2025-04-25",
    nextBooking: null
  },
  {
    id: "102",
    type: "Standard Room",
    status: "occupied",
    floor: 1,
    price: 120,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    lastCleaned: "2025-04-24",
    nextBooking: null
  },
  {
    id: "103",
    type: "Standard Room",
    status: "maintenance",
    floor: 1,
    price: 120,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    lastCleaned: "2025-04-23",
    nextBooking: null
  },
  {
    id: "201",
    type: "Deluxe Room",
    status: "available",
    floor: 2,
    price: 180,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View"],
    lastCleaned: "2025-04-25",
    nextBooking: "2025-04-28"
  },
  {
    id: "202",
    type: "Deluxe Room",
    status: "occupied",
    floor: 2,
    price: 180,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View"],
    lastCleaned: "2025-04-24",
    nextBooking: null
  },
  {
    id: "301",
    type: "Family Suite",
    status: "available",
    floor: 3,
    price: 250,
    maxOccupancy: 4,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Kitchenette"],
    lastCleaned: "2025-04-25",
    nextBooking: "2025-04-30"
  },
  {
    id: "302",
    type: "Family Suite",
    status: "occupied",
    floor: 3,
    price: 250,
    maxOccupancy: 4,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Kitchenette"],
    lastCleaned: "2025-04-23",
    nextBooking: null
  },
  {
    id: "401",
    type: "Presidential Suite",
    status: "available",
    floor: 4,
    price: 500,
    maxOccupancy: 2,
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Ocean View", "Kitchenette", "Private Balcony", "Jacuzzi"],
    lastCleaned: "2025-04-25",
    nextBooking: null
  }
];

const RoomsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState(roomsData);
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter rooms based on search term and status filter
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = 
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      activeFilter === "all" ||
      activeFilter === room.status;
    
    return matchesSearch && matchesFilter;
  });

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Maintenance</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Reserved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
        <Input
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={activeFilter === "available" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("available")}
          >
            Available
          </Button>
          <Button 
            variant={activeFilter === "occupied" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("occupied")}
          >
            Occupied
          </Button>
          <Button 
            variant={activeFilter === "maintenance" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveFilter("maintenance")}
          >
            Maintenance
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Max Guests</TableHead>
              <TableHead>Next Booking</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.id}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{getStatusBadge(room.status)}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>{formatCurrency(room.price)}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>{room.maxOccupancy}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {room.nextBooking ? (
                    <Badge variant="outline">{room.nextBooking}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Room
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {room.status === 'available' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <BedDouble className="mr-2 h-4 w-4" /> Mark as Occupied
                        </DropdownMenuItem>
                      )}
                      {room.status === 'occupied' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <Check className="mr-2 h-4 w-4" /> Mark as Available
                        </DropdownMenuItem>
                      )}
                      {room.status !== 'maintenance' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <X className="mr-2 h-4 w-4" /> Mark for Maintenance
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredRooms.length}</span> of{" "}
          <span className="font-medium">{rooms.length}</span> rooms
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filteredRooms.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filteredRooms.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomsTable;