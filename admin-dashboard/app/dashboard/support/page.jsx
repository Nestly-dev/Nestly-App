// app/dashboard/support/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Phone,
  Mail,
  Send,
  Search,
  PlusCircle,
  Inbox
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// FAQ Section Component
const FAQSection = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How do I update room availability?</AccordionTrigger>
        <AccordionContent>
          You can update room availability by navigating to the Rooms section, selecting the room you want to update, and changing its status. Alternatively, you can use the Calendar view to manage availability across multiple dates.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I respond to guest reviews?</AccordionTrigger>
        <AccordionContent>
          To respond to guest reviews, go to the Reviews section, find the review you want to respond to, click the action menu, and select "Respond." Type your response in the dialog that appears and click "Submit."
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How can I create a special offer or discount?</AccordionTrigger>
        <AccordionContent>
          To create a special offer or discount, navigate to the Rooms section, go to the "Pricing" tab, and select "Special Offers." Click "Add Offer" and fill in the details including discount percentage, applicable dates, and terms.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>How do I add new photos to my hotel gallery?</AccordionTrigger>
        <AccordionContent>
          To add new photos, go to the Gallery section and click the "Add Media" button in the top right corner. You can upload individual images or do a bulk upload. Once uploaded, you can add captions, categorize the images, and mark them as featured if desired.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>How do I generate reports on bookings and revenue?</AccordionTrigger>
        <AccordionContent>
          You can generate reports from the Dashboard by using the date selector to specify your desired time range. For more detailed reports, go to the Bookings section and use the "Export" function to download data in various formats including CSV and PDF.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// Support Tickets Component
const SupportTickets = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            className="pl-8 bg-gray-50 border-gray-200"
            placeholder="Search tickets..."
          />
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Ticket
        </Button>
      </div>
      
      {[
        {
          id: "TCK-1234",
          subject: "Payment processing issue",
          status: "open",
          priority: "high",
          lastUpdate: "2025-04-15",
          department: "Billing"
        },
        {
          id: "TCK-1235",
          subject: "Cannot update room information",
          status: "in-progress",
          priority: "medium",
          lastUpdate: "2025-04-12",
          department: "Technical"
        },
        {
          id: "TCK-1236",
          subject: "Need help with booking cancellation policy",
          status: "open",
          priority: "low",
          lastUpdate: "2025-04-10",
          department: "Bookings"
        },
        {
          id: "TCK-1237",
          subject: "Media upload failing",
          status: "closed",
          priority: "medium",
          lastUpdate: "2025-04-05",
          department: "Technical"
        }
      ].map((ticket) => (
        <Card key={ticket.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{ticket.subject}</h4>
                  <Badge className={`
                    ${ticket.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                      ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}
                  `}>
                    {ticket.status === 'open' ? 'Open' : 
                     ticket.status === 'in-progress' ? 'In Progress' : 
                     'Closed'}
                  </Badge>
                  <Badge className={`
                    ${ticket.priority === 'high' ? 'bg-red-100 text-red-800' : 
                      ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}
                  `}>
                    {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ticket #{ticket.id} • {ticket.department} • Last updated: {ticket.lastUpdate}</p>
              </div>
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" /> Reply
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="flex justify-center">
        <Button variant="outline">View All Tickets</Button>
      </div>
    </div>
  );
};

// Documentation Component
const Documentation = () => {
  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          className="pl-8 bg-gray-50 border-gray-200"
          placeholder="Search documentation..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-700" />
              </div>
              <div>
                <h3 className="font-medium">Getting Started Guide</h3>
                <p className="text-sm text-muted-foreground mt-1">A complete guide to set up your hotel dashboard</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <FileText className="h-6 w-6 text-purple-700" />
              </div>
              <div>
                <h3 className="font-medium">Room Management</h3>
                <p className="text-sm text-muted-foreground mt-1">Learn how to manage room types, pricing, and availability</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-700" />
              </div>
              <div>
                <h3 className="font-medium">Booking Management</h3>
                <p className="text-sm text-muted-foreground mt-1">How to process, modify, and cancel bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-amber-100">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h3 className="font-medium">Gallery & Media</h3>
                <p className="text-sm text-muted-foreground mt-1">Best practices for managing your hotel's visual content</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-100">
                <FileText className="h-6 w-6 text-red-700" />
              </div>
              <div>
                <h3 className="font-medium">Review Management</h3>
                <p className="text-sm text-muted-foreground mt-1">How to respond to and manage guest reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-indigo-100">
                <FileText className="h-6 w-6 text-indigo-700" />
              </div>
              <div>
                <h3 className="font-medium">Analytics & Reporting</h3>
                <p className="text-sm text-muted-foreground mt-1">Understanding your hotel's performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button variant="outline">View All Documentation</Button>
      </div>
    </div>
  );
};

// Contact Support Component
const ContactSupport = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center flex-col text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-medium mb-2">Phone Support</h3>
              <p className="text-muted-foreground mb-4">Available Monday-Friday, 9am-5pm ET</p>
              <p className="font-medium">+1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center flex-col text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-medium mb-2">Email Support</h3>
              <p className="text-muted-foreground mb-4">We'll respond within 24 hours</p>
              <p className="font-medium">support@viatravels.com</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center flex-col text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-700" />
              </div>
              <h3 className="font-medium mb-2">Live Chat</h3>
              <p className="text-muted-foreground mb-4">Available 24/7 for urgent issues</p>
              <Button>
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
          <CardDescription>
            We'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="What's your message about?" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                className="w-full min-h-[100px] border rounded-md p-2"
                placeholder="How can we help you?"
              />
            </div>
            <Button className="w-full md:w-auto">
              <Send className="mr-2 h-4 w-4" /> Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support & Help</h1>
          <p className="text-muted-foreground">
            Get help and learn more about the platform
          </p>
        </div>
        <Button variant="outline">
          <Inbox className="mr-2 h-4 w-4" /> View My Tickets
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
              <p className="text-2xl font-bold">3</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">1 high priority</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Avg. Response Time</p>
              <p className="text-2xl font-bold">3.5 hours</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Faster than average</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Documentation</p>
              <p className="text-2xl font-bold">23 guides</p>
              <Badge className="w-fit mt-1 bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">New content added</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Satisfaction Rate</p>
              <p className="text-2xl font-bold">95%</p>
              <Badge className="w-fit mt-1 bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">Based on 42 ratings</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faq">
        <TabsList>
          <TabsTrigger value="faq" className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" /> FAQ
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" /> Support Tickets
          </TabsTrigger>
          <TabsTrigger value="documentation" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" /> Documentation
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center">
            <Phone className="h-4 w-4 mr-2" /> Contact Us
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about using the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FAQSection />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tickets" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Tickets</CardTitle>
              <CardDescription>
                View and manage your support tickets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportTickets />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documentation & Guides</CardTitle>
              <CardDescription>
                Comprehensive guides to help you get the most out of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Documentation />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactSupport />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}