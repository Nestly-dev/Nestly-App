// components/dashboard/RecentReviews.jsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

// Sample data for recent reviews
const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/avatars/sarah.jpg",
    rating: 5,
    comment: "Amazing hotel with exceptional service. The staff went above and beyond to make our stay memorable.",
    date: "2025-04-15",
    room: "Deluxe Suite"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/avatars/michael.jpg",
    rating: 4,
    comment: "Great location and beautiful views. The room was clean and comfortable.",
    date: "2025-04-10",
    room: "Standard Room"
  },
  {
    id: 3,
    name: "Emily Garcia",
    avatar: "/avatars/emily.jpg", 
    rating: 5,
    comment: "Perfect for our family vacation. The kids loved the pool area!",
    date: "2025-04-05",
    room: "Family Suite"
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/avatars/david.jpg",
    rating: 3,
    comment: "The location was convenient but room service was a bit slow.",
    date: "2025-03-28",
    room: "Junior Suite"
  }
];

const RecentReviews = () => {
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
    <div className="space-y-4 max-h-96 overflow-auto pr-2">
      {reviews.map((review) => (
        <div key={review.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
          <Avatar>
            <AvatarImage src={review.avatar} alt={review.name} />
            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{review.name}</h4>
                <p className="text-xs text-muted-foreground">{review.room} • {formatDate(review.date)}</p>
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        </div>
      ))}
      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors py-2">
        View all reviews
      </button>
    </div>
  );
};

export default RecentReviews;