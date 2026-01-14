// components/dashboard/RecentReviews.jsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Star } from "lucide-react";

const RecentReviews = ({ hotelId, reviews = [] }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
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

  const recentReviews = Array.isArray(reviews) ? reviews.slice(0, 5) : [];

  if (recentReviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-auto pr-2">
      {recentReviews.map((review) => (
        <div key={review.id} className="flex items-start space-x-3 pb-4 border-b last:border-0">
          <Avatar className="bg-blue-100">
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {getInitials(review.reviewer_name || 'User')}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{review.reviewer_name || 'Guest'}</h4>
                <p className="text-xs text-muted-foreground">
                  {formatDate(review.created_at || review.date)}
                </p>
              </div>
              <div className="flex">{renderStars(review.rating || 0)}</div>
            </div>
            <p className="text-sm text-gray-700">{review.comment || review.review_text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentReviews;