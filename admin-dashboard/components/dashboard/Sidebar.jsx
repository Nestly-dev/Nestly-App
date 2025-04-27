// components/dashboard/Sidebar.jsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  MessageSquare, 
  Image as ImageIcon, 
  Bed, 
  HelpCircle, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const NavItems = [
    {
      title: 'Overview',
      href: '/dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: 'Bookings',
      href: '/dashboard/bookings',
      icon: <CalendarDays size={20} />,
    },
    {
      title: 'Reviews',
      href: '/dashboard/reviews',
      icon: <MessageSquare size={20} />,
    },
    {
      title: 'Gallery',
      href: '/dashboard/gallery',
      icon: <ImageIcon size={20} />,
    },
    {
      title: 'Rooms',
      href: '/dashboard/rooms',
      icon: <Bed size={20} />,
    },
    {
      title: 'Support',
      href: '/dashboard/support',
      icon: <HelpCircle size={20} />,
    },
  ];

  const sidebarClasses = cn(
    'bg-white h-screen transition-all duration-300 flex flex-col border-r shadow-sm',
    {
      'w-72': !collapsed,
      'w-20': collapsed,
      'fixed inset-y-0 left-0 z-50 md:relative': true,
      'translate-x-0': mobileOpen || !isMobile,
      '-translate-x-full': !mobileOpen && isMobile,
    }
  );

  return (
    <>
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        >
          <Menu />
        </Button>
      )}
      
      <div className={sidebarClasses}>
        <div className="p-4 flex justify-between items-center">
          <div className={cn("flex items-center", { "justify-center w-full": collapsed })}>
            {!collapsed && (
              <span className="text-xl font-bold ml-2">Hotel Manager</span>
            )}
            {collapsed && <span className="text-xl font-bold">HM</span>}
          </div>
          
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="hidden md:flex">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", {
                "rotate-180": collapsed
              })} />
            </Button>
          )}
        </div>

        <div className="px-3 py-2">
          {!collapsed && (
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/hotel-avatar.jpg" alt="Hotel" />
                  <AvatarFallback>HT</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium">Grand Palace Hotel</h3>
                  <p className="text-xs text-muted-foreground">Hotel Manager</p>
                </div>
              </div>
            </div>
          )}
          
          <nav className="space-y-1.5">
            {NavItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center py-2.5 px-3 rounded-md transition-colors",
                  pathname === item.href 
                    ? "bg-gray-100 text-primary" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-primary",
                  {
                    "justify-center": collapsed
                  }
                )}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <Button 
            variant="outline" 
            className={cn("flex items-center w-full", {
              "justify-center": collapsed
            })}
          >
            <LogOut size={20} />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
      
      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;