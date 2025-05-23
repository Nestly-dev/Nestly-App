// components/dashboard/BookingsTable.jsx
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
  CheckCircle, 
  XCircle,
  MessageSquare
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Sample bookings data
const bookingsData = [
  {
    id: "BOO-1234",
    guestName: "John Doe",
    checkIn: "2025-05-15",
    checkOut: "2025-05-20",
    roomType: "Deluxe Suite",
    totalAmount: 1250.00,
    status: "confirmed",
    paymentStatus: "paid",
    guests: 2,
    email: "john.doe@example.com",
    phone: "+1 555-123-4567"
  },
  {
    id: "BOO-1235",
    guestName: "Sarah Johnson",
    checkIn: "2025-05-17",
    checkOut: "2025-05-19",
    roomType: "Standard Room",
    totalAmount: 420.00,
    status: "confirmed",
    paymentStatus: "pending",
    guests: 1,
    email: "sarah.j@example.com",
    phone: "+1 555-765-4321"
  },
  {
    id: "BOO-1236",
    guestName: "Michael Chen",
    checkIn: "2025-05-20",
    checkOut: "2025-05-25",
    roomType: "Family Suite",
    totalAmount: 1875.00,
    status: "pending",
    paymentStatus: "paid",
    guests: 4,
    email: "mchen@example.com",
    phone: "+1 555-987-6543"
  },
  {
    id: "BOO-1237",
    guestName: "Emily Garcia",
    checkIn: "2025-05-16",
    checkOut: "2025-05-18",
    roomType: "Junior Suite",
    totalAmount: 580.00,
    status: "checked-in",
    paymentStatus: "paid",
    guests: 2,
    email: "emily.g@example.com",
    phone: "+1 555-456-7890"
  },
  {
    id: "BOO-1238",
    guestName: "David Wilson",
    checkIn: "2025-05-18",
    checkOut: "2025-05-24",
    roomType: "Presidential Suite",
    totalAmount: 3200.00,
    status: "confirmed",
    paymentStatus: "partial",
    guests: 2,
    email: "d.wilson@example.com",
    phone: "+1 555-789-0123"
  },
  {
    id: "BOO-1239",
    guestName: "Jessica Brown",
    checkIn: "2025-05-14",
    checkOut: "2025-05-16",
    roomType: "Standard Room",
    totalAmount: 380.00,
    status: "cancelled",
    paymentStatus: "refunded",
    guests: 1,
    email: "jbrown@example.com",
    phone: "+1 555-234-5678"
  },
  {
    id: "BOO-1240",
    guestName: "Robert Martinez",
    checkIn: "2025-05-19",
    checkOut: "2025-05-21",
    roomType: "Deluxe Suite",
    totalAmount: 890.00,
    status: "confirmed",
    paymentStatus: "paid",
    guests: 2,
    email: "rmartinez@example.com",
    phone: "+1 555-876-5432"
  },
  {
    id: "BOO-1241",
    guestName: "Laura Taylor",
    checkIn: "2025-05-22",
    checkOut: "2025-05-25",
    roomType: "Standard Room",
    totalAmount: 630.00,
    status: "pending",
    paymentStatus: "pending",
    guests: 2,
    email: "laura.t@example.com",
    phone: "+1 555-345-6789"
  }
];

const BookingsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState(bookingsData);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => 
    booking.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Pending</Badge>;
      case 'checked-in':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Checked In</Badge>;
      case 'checked-out':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100">Checked Out</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get payment status badge style
  const getPaymentBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Pending</Badge>;
      case 'partial':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Partial</Badge>;
      case 'refunded':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.id}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground">{booking.guests} guests</p>
                  </div>
                </TableCell>
                <TableCell>{booking.roomType}</TableCell>
                <TableCell>{formatDate(booking.checkIn)}</TableCell>
                <TableCell>{formatDate(booking.checkOut)}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
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
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Booking
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {booking.status === 'confirmed' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckCircle className="mr-2 h-4 w-4" /> Check In
                        </DropdownMenuItem>
                      )}
                      {booking.status === 'checked-in' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckCircle className="mr-2 h-4 w-4" /> Check Out
                        </DropdownMenuItem>
                      )}
                      {(booking.status === 'confirmed' || booking.status === 'pending') && (
                        <DropdownMenuItem className="cursor-pointer">
                          <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                      </DropdownMenuItem>
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
          Showing <span className="font-medium">{filteredBookings.length}</span> of{" "}
          <span className="font-medium">{bookings.length}</span> bookings
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filteredBookings.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filteredBookings.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingsTable;