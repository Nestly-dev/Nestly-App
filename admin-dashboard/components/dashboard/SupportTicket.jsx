// components/dashboard/SupportTickets.jsx
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
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  X
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// Sample tickets data
const ticketsData = [
  {
    id: "TKT-1234",
    subject: "Payment Processing Issue",
    category: "Billing",
    status: "open",
    priority: "high",
    dateCreated: "2025-04-10",
    lastUpdated: "2025-04-12",
    assignedTo: "Support Team"
  },
  {
    id: "TKT-1235",
    subject: "Room Inventory Not Updating",
    category: "Inventory",
    status: "in-progress",
    priority: "medium",
    dateCreated: "2025-04-15",
    lastUpdated: "2025-04-15",
    assignedTo: "Technical Team"
  },
  {
    id: "TKT-1236",
    subject: "Need Help with Booking Reports",
    category: "Reports",
    status: "open",
    priority: "low",
    dateCreated: "2025-04-18",
    lastUpdated: "2025-04-18",
    assignedTo: "Support Team"
  },
  {
    id: "TKT-1237",
    subject: "API Integration Question",
    category: "Technical",
    status: "resolved",
    priority: "medium",
    dateCreated: "2025-04-05",
    lastUpdated: "2025-04-08",
    assignedTo: "Developer Team"
  },
  {
    id: "TKT-1238",
    subject: "Account Access Issue",
    category: "Account",
    status: "open",
    priority: "high",
    dateCreated: "2025-04-19",
    lastUpdated: "2025-04-19",
    assignedTo: "Security Team"
  }
];

const SupportTickets = () => {
  const [tickets, setTickets] = useState(ticketsData);
  const [activeFilter, setActiveFilter] = useState("all");

  // Filter tickets based on status filter
  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === "all") return true;
    if (activeFilter === "open") return ticket.status === "open";
    if (activeFilter === "in-progress") return ticket.status === "in-progress";
    if (activeFilter === "resolved") return ticket.status === "resolved";
    return true;
  });

  // Function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">Closed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Function to get priority badge style
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="outline" className="border-red-500 text-red-500">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="border-green-500 text-green-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex space-x-2 py-4">
        <Button 
          variant={activeFilter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("all")}
        >
          All Tickets
        </Button>
        <Button 
          variant={activeFilter === "open" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("open")}
        >
          Open
        </Button>
        <Button 
          variant={activeFilter === "in-progress" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("in-progress")}
        >
          In Progress
        </Button>
        <Button 
          variant={activeFilter === "resolved" ? "default" : "outline"} 
          size="sm"
          onClick={() => setActiveFilter("resolved")}
        >
          Resolved
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                <TableCell>{formatDate(ticket.dateCreated)}</TableCell>
                <TableCell>{formatDate(ticket.lastUpdated)}</TableCell>
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
                        <MessageSquare className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      
                      {ticket.status === "open" && (
                        <DropdownMenuItem className="cursor-pointer">
                          <Clock className="mr-2 h-4 w-4" /> Mark as In Progress
                        </DropdownMenuItem>
                      )}
                      
                      {(ticket.status === "open" || ticket.status === "in-progress") && (
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckCircle className="mr-2 h-4 w-4" /> Mark as Resolved
                        </DropdownMenuItem>
                      )}
                      
                      {ticket.status === "resolved" && (
                        <DropdownMenuItem className="cursor-pointer">
                          <RefreshCw className="mr-2 h-4 w-4" /> Reopen Ticket
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem className="cursor-pointer">
                        <AlertCircle className="mr-2 h-4 w-4" /> Escalate
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <X className="mr-2 h-4 w-4" /> Close Ticket
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredTickets.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No tickets match your current filter</p>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;