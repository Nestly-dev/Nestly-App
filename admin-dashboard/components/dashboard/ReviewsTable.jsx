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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MoreHorizontal, 
  Reply, 
  Flag,
  Star,
  ThumbsUp,
  ThumbsDown,
  Trash
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Sample reviews data
const reviewsData = [
  {
    id: 1,
    guestName: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    date: "2025-04-15",
    rating: 5,
    comment: "Amazing hotel with exceptional service. The staff went above and beyond to make our stay memorable.",
    roomType: "Deluxe Suite",
    responded: true,
    response: "Thank you for your kind words, Sarah! We're thrilled you enjoyed your stay with us.",
    responseDate: "2025-04-16",
    flagged: false
  },
  {
    id: 2,
    guestName: "Michael Chen",
    avatar: "/avatars/michael.jpg",
    date: "2025-04-10",
    rating: 4,
    comment: "Great location and beautiful views. The room was clean and comfortable. The only downside was the slow Wi-Fi.",
    roomType: "Standard Room",
    responded: false,
    response: null,
    responseDate: null,
    flagged: false
  },
  {
    id: 3,
    guestName: "Emily Garcia",
    avatar: "/avatars/emily.jpg",
    date: "2025-04-05",
    rating: 5,
    comment: "Perfect for our family vacation. The kids loved the pool area!",
    roomType: "Family Suite",
    responded: true,
    response: "We're so happy your family enjoyed their stay with us, Emily! The pool is definitely a favorite among our younger guests.",
    responseDate: "2025-04-06",
    flagged: false
  },
  {
    id: 4,
    guestName: "David Wilson",
    avatar: "/avatars/david.jpg",
    date: "2025-03-28",
    rating: 3,
    comment: "The location was convenient but room service was slow and the bathroom needed some maintenance.",
    roomType: "Junior Suite",
    responded: false,
    response: null,
    responseDate: null,
    flagged: true
  },
  {
    id: 5,
    guestName: "Lisa Thompson",
    avatar: "/avatars/lisa.jpg",
    date: "2025-03-25",
    rating: 4,
    comment: "Lovely hotel with friendly staff. The breakfast buffet was excellent!",
    roomType: "Deluxe Room",
    responded: false,
    response: null,
    responseDate: null,
    flagged: false
  }
];

const ReviewsTable = ({ filterBy }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reviews, setReviews] = useState(reviewsData);

  // Filter reviews based on search term and filter type
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "pending") {
      return matchesSearch && !review.responded;
    } else if (filterBy === "responded") {
      return matchesSearch && review.responded;
    } else if (filterBy === "flagged") {
      return matchesSearch && review.flagged;
    }
    
    return matchesSearch;
  });

  // Function to render stars based on rating
  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id} className={review.flagged ? "bg-red-50" : ""}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.guestName} />
                      <AvatarFallback>{review.guestName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.guestName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex">{renderStars(review.rating)}</div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="text-sm truncate">{review.comment}</p>
                    {review.responded && (
                      <div className="mt-1 text-xs italic text-gray-500">
                        Response: {review.response.length > 30 ? `${review.response.substring(0, 30)}...` : review.response}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{review.roomType}</TableCell>
                <TableCell>{formatDate(review.date)}</TableCell>
                <TableCell>
                  {review.responded ? (
                    <Badge className="bg-green-100 text-green-800">Responded</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  )}
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
                        <Reply className="mr-2 h-4 w-4" /> {review.responded ? "Edit Response" : "Respond"}
                      </DropdownMenuItem>
                      
                      {!review.flagged ? (
                        <DropdownMenuItem className="cursor-pointer">
                          <Flag className="mr-2 h-4 w-4" /> Flag for Follow-Up
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="cursor-pointer">
                          <Flag className="mr-2 h-4 w-4" /> Remove Flag
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem className="cursor-pointer">
                        <ThumbsUp className="mr-2 h-4 w-4" /> Mark as Helpful
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