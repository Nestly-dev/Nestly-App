// components/dashboard/BookingCalendar.jsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Sample bookings data
const bookingsData = [
  {
    id: "BOO-1234",
    guestName: "John Doe",
    checkIn: new Date("2025-05-15"),
    checkOut: new Date("2025-05-20"),
    roomType: "Deluxe Suite",
    totalAmount: 1250.00,
    status: "confirmed",
    roomNumber: "301"
  },
  {
    id: "BOO-1235",
    guestName: "Sarah Johnson",
    checkIn: new Date("2025-05-17"),
    checkOut: new Date("2025-05-19"),
    roomType: "Standard Room",
    totalAmount: 420.00,
    status: "confirmed",
    roomNumber: "105"
  },
  {
    id: "BOO-1236",
    guestName: "Michael Chen",
    checkIn: new Date("2025-05-20"),
    checkOut: new Date("2025-05-25"),
    roomType: "Family Suite",
    totalAmount: 1875.00,
    status: "pending",
    roomNumber: "402"
  },
  {
    id: "BOO-1237",
    guestName: "Emily Garcia",
    checkIn: new Date("2025-05-16"),
    checkOut: new Date("2025-05-18"),
    roomType: "Junior Suite",
    totalAmount: 580.00,
    status: "checked-in",
    roomNumber: "210"
  },
  {
    id: "BOO-1238",
    guestName: "David Wilson",
    checkIn: new Date("2025-05-18"),
    checkOut: new Date("2025-05-24"),
    roomType: "Presidential Suite",
    totalAmount: 3200.00,
    status: "confirmed",
    roomNumber: "501"
  }
];

// Function to get dates between two dates
function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Function to check if a date has booking
function getBookingsForDate(date) {
  const dateStr = date.toISOString().split('T')[0];
  
  // Get check-ins on this date
  const checkIns = bookingsData.filter(booking => 
    booking.checkIn.toISOString().split('T')[0] === dateStr
  );
  
  // Get check-outs on this date
  const checkOuts = bookingsData.filter(booking => 
    booking.checkOut.toISOString().split('T')[0] === dateStr
  );
  
  // Get bookings active on this date (neither check-in nor check-out)
  const active = bookingsData.filter(booking => {
    const bookingDates = getDatesInRange(booking.checkIn, booking.checkOut);
    return bookingDates.some(
      d => 
        d.toISOString().split('T')[0] === dateStr && 
        booking.checkIn.toISOString().split('T')[0] !== dateStr &&
        booking.checkOut.toISOString().split('T')[0] !== dateStr
    );
  });
  
  return { checkIns, checkOuts, active };
}

const BookingCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateBookings, setDateBookings] = useState(null);
  
  // Handle date selection
  const handleSelect = (selectedDate) => {
    setSelectedDate(selectedDate);
    setDateBookings(getBookingsForDate(selectedDate));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
      <div className="md:col-span-5">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          className="border rounded-md p-3"
          classNames={{
            day_today: "bg-blue-50 text-blue-900 font-semibold",
          }}
          components={{
            DayContent: (props) => {
              const { date, ...rest } = props;
              
              if (!date) return null;
              
              const { checkIns, checkOuts, active } = getBookingsForDate(date);
              const hasBookings = checkIns.length > 0 || checkOuts.length > 0 || active.length > 0;
              
              return (
                <div {...rest} className="relative w-full h-full">
                  <span>{date.getDate()}</span>
                  {hasBookings && (
                    <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-0.5">
                      {checkIns.length > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      )}
                      {active.length > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      )}
                      {checkOuts.length > 0 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      )}
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
        
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Check-ins</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Active Stay</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Check-outs</span>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            {selectedDate ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {formatDate(selectedDate)}
                  </h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const prevDate = new Date(selectedDate);
                        prevDate.setDate(prevDate.getDate() - 1);
                        setSelectedDate(prevDate);
                        setDateBookings(getBookingsForDate(prevDate));
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        const nextDate = new Date(selectedDate);
                        nextDate.setDate(nextDate.getDate() + 1);
                        setSelectedDate(nextDate);
                        setDateBookings(getBookingsForDate(nextDate));
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {dateBookings && (
                  <div className="space-y-4">
                    {dateBookings.checkIns.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium flex items-center">
                          <Badge className="bg-green-100 text-green-800 mr-2">Check-ins</Badge>
                          <span>{dateBookings.checkIns.length} total</span>
                        </h4>
                        <div className="mt-2 space-y-2">
                          {dateBookings.checkIns.map((booking) => (
                            <div key={booking.id} className="p-2 bg-green-50 rounded-md">
                              <p className="font-medium">{booking.guestName}</p>
                              <div className="text-xs space-y-1 mt-1">
                                <p>Room: {booking.roomNumber} ({booking.roomType})</p>
                                <p>Until: {formatDate(booking.checkOut)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {dateBookings.active.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium flex items-center">
                          <Badge className="bg-blue-100 text-blue-800 mr-2">Active Stay</Badge>
                          <span>{dateBookings.active.length} total</span>
                        </h4>
                        <div className="mt-2 space-y-2">
                          {dateBookings.active.map((booking) => (
                            <div key={booking.id} className="p-2 bg-blue-50 rounded-md">
                              <p className="font-medium">{booking.guestName}</p>
                              <div className="text-xs space-y-1 mt-1">
                                <p>Room: {booking.roomNumber} ({booking.roomType})</p>
                                <p>From: {formatDate(booking.checkIn)}</p>
                                <p>Until: {formatDate(booking.checkOut)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {dateBookings.checkOuts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium flex items-center">
                          <Badge className="bg-red-100 text-red-800 mr-2">Check-outs</Badge>
                          <span>{dateBookings.checkOuts.length} total</span>
                        </h4>
                        <div className="mt-2 space-y-2">
                          {dateBookings.checkOuts.map((booking) => (
                            <div key={booking.id} className="p-2 bg-red-50 rounded-md">
                              <p className="font-medium">{booking.guestName}</p>
                              <div className="text-xs space-y-1 mt-1">
                                <p>Room: {booking.roomNumber} ({booking.roomType})</p>
                                <p>Since: {formatDate(booking.checkIn)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {dateBookings.checkIns.length === 0 && 
                     dateBookings.active.length === 0 && 
                     dateBookings.checkOuts.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        <p>No bookings for this date</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <p>Select a date to view bookings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingCalendar;