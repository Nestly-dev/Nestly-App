// components/dashboard/ReviewsTable.jsx
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
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Sample reviews data
const reviewsData = [
  {
    id: "REV-1234",
    guestName: "John Doe",
    rating: 5,
    comment: "Excellent service and beautiful room. The staff was very friendly and helpful. Would definitely recommend!",
    date: "2025-04-20",
    roomType: "Deluxe Suite",
    status: "published",
    helpful: 12,
    notHelpful: 2
  },
  {
    id: "REV-1235",
    guestName: "Sarah Johnson",
    rating: 4,
    comment: "Great location and clean rooms. The breakfast was delicious. Only minor issue was the slow WiFi in the room.",
    date: "2025-04-18",
    roomType: "Standard Room",
    status: "published",
    helpful: 8,
    notHelpful: 1
  },
  {
    id: "REV-1236",
    guestName: "Michael Chen",
    rating: 3,
    comment: "The room was clean but quite small for the price. Staff was friendly though. Average experience overall.",
    date: "2025-04-15",
    roomType: "Standard Room",
    status: "published",
    helpful: 5,
    notHelpful: 3
  },
  {
    id: "REV-1237",
    guestName: "Emily Garcia",
    rating: 5,
    comment: "Absolutely amazing! The presidential suite was incredible with ocean views. Service was impeccable. Worth every penny!",
    date: "2025-04-12",
    roomType: "Presidential Suite",
    status: "published",
    helpful: 15,
    notHelpful: 0
  },
  {
    id: "REV-1238",
    guestName: "David Wilson",
    rating: 2,
    comment: "Disappointed with the service. Room wasn't ready on time and the staff was unhelpful. Won't be returning.",
    date: "2025-04-10",
    roomType: "Deluxe Suite",
    status: "pending",
    helpful: 2,
    notHelpful: 8
  },
  {
    id: "REV-1239",
    guestName: "Jessica Brown",
    rating: 4,
    comment: "Nice hotel with good amenities. The pool area was great. Room was clean and comfortable.",
    date: "2025-04-08",
    roomType: "Junior Suite",
    status: "published",
    helpful: 6,
    notHelpful: 2
  },
  {
    id: "REV-1240",
    guestName: "Robert Martinez",
    rating: 5,
    comment: "Perfect family vacation! The family suite was spacious and the kids loved the pool. Staff went above and beyond.",
    date: "2025-04-05",
    roomType: "Family Suite",
    status: "published",
    helpful: 18,
    notHelpful: 1
  },
  {
    id: "REV-1241",
    guestName: "Laura Taylor",
    rating: 1,
    comment: "Terrible experience. Room was dirty, AC didn't work, and staff was rude. Avoid this hotel at all costs.",
    date: "2025-04-03",
    roomType: "Standard Room",
    status: "flagged",
    helpful: 1,
    notHelpful: 12
  }
];

const ReviewsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState(reviewsData);
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter reviews based on search term and status filter
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      statusFilter === "all" ||
      statusFilter === review.status;
    
    return matchesSearch && matchesFilter;
  });

  // Function to render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Published</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">Pending</Badge>;
      case 'flagged':
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">Flagged</Badge>;
      case 'hidden':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">Hidden</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-3">
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex space-x-2">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "published" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("published")}
          >
            Published
          </Button>
          <Button 
            variant={statusFilter === "pending" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === "flagged" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("flagged")}
          >
            Flagged
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Helpful</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="font-medium">{review.guestName}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({review.rating}/5)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-sm line-clamp-2">{review.comment}</p>
                  </div>
                </TableCell>
                <TableCell>{review.roomType}</TableCell>
                <TableCell>{formatDate(review.date)}</TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-green-600">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs">{review.helpful}</span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      <span className="text-xs">{review.notHelpful}</span>
                    </div>
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
                        <Eye className="mr-2 h-4 w-4" /> View Full Review
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Review
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {review.status === 'pending' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                      )}
                      {review.status === 'published' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <ThumbsDown className="mr-2 h-4 w-4" /> Hide
                        </DropdownMenuItem>
                      )}
                      {review.status === 'flagged' && (
                        <DropdownMenuItem className="cursor-pointer">
                          <ThumbsUp className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" /> Reply
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
          Showing <span className="font-medium">{filteredReviews.length}</span> of{" "}
          <span className="font-medium">{reviews.length}</span> reviews
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={filteredReviews.length === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filteredReviews.length === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewsTable;