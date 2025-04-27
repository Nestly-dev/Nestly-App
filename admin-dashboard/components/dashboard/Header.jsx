// components/dashboard/Header.jsx
"use client";

import { useState } from 'react';
import { Bell, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white border-b p-4 flex items-center justify-between">
      <div className="relative w-64">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-8 bg-gray-50 border-gray-200"
          placeholder="Search..."
        />
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
            <div className="px-4 py-3 font-medium">Notifications</div>
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
            <DropdownMenuItem className="justify-center cursor-pointer">
              <p className="text-sm text-blue-500">View all notifications</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;