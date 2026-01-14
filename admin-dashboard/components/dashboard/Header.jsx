// components/dashboard/Header.jsx
"use client";

import { useState } from 'react';
import { Bell, Search, Sun, Moon, LogOut, User, Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [theme, setTheme] = useState("light");
  const { user, hotel, hotels, logout, switchHotel } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle('dark');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.username || user.email || 'User';
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Hotel Selector */}
        {hotels && hotels.length > 1 && (
          <Select
            value={hotel?.id}
            onValueChange={(value) => switchHotel(value)}
          >
            <SelectTrigger className="w-[250px]">
              <Building2 size={16} className="mr-2" />
              <SelectValue placeholder="Select hotel" />
            </SelectTrigger>
            <SelectContent>
              {hotels.map((h) => (
                <SelectItem key={h.id} value={h.id}>
                  {h.name || `Hotel ${h.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Current Hotel Display */}
        {hotels && hotels.length === 1 && hotel && (
          <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-md">
            <Building2 size={16} className="text-[#1995AD]" />
            <span className="text-sm font-medium text-[#1995AD]">
              {hotel.name || `Hotel ${hotel.id}`}
            </span>
          </div>
        )}

        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-8 bg-gray-50 border-gray-200 text-black"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button onClick={toggleTheme} variant="ghost" size="icon">
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New Booking</p>
                <p className="text-xs text-gray-500">John Doe booked a room for 5 nights</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New Review</p>
                <p className="text-xs text-gray-500">Sarah Smith left a 5-star review</p>
                <p className="text-xs text-gray-400">5 hours ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center cursor-pointer">
              <p className="text-sm text-blue-500">View all notifications</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-[#1995AD] text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.username || 'User'}
                </span>
                <span className="text-xs text-gray-500">
                  {user?.role || 'Manager'}
                </span>
              </div>
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Building2 className="mr-2 h-4 w-4" />
              <span>Hotel Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;