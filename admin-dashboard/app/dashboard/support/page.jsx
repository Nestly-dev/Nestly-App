// app/dashboard/support/page.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  FileText, 
  LifeBuoy,
  CheckCircle,
  Clock,
  Users,
  AlertCircle
} from "lucide-react";
import SupportTickets from "@/components/dashboard/SupportTickets";
import SupportForm from "@/components/dashboard/SupportForm";
import FAQSection from "@/components/dashboard/FAQSection";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground">
            Get help with your hotel management system
          </p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Active Tickets</p>
              <p className="text-2xl font-bold">3</p>
              <Badge className="w-fit mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200">1 high priority</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Average Response Time</p>
              <p className="text-2xl font-bold">4 hours</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Within SLA</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Resolved This Month</p>
              <p className="text-2xl font-bold">12</p>
              <Badge className="w-fit mt-1 bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200">+3 from last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-muted-foreground">Satisfaction Rate</p>
              <p className="text-2xl font-bold">94%</p>
              <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Very Good</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
              <CardDescription>
                Track and manage your support requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportTickets />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Submit a new support request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupportForm />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Help Center</CardTitle>
          <CardDescription>
            Quick access to common resources and FAQs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Documentation</h3>
                    <p className="text-sm text-muted-foreground">User manuals and guides</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">View Docs</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <LifeBuoy className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Knowledge Base</h3>
                    <p className="text-sm text-muted-foreground">Search for answers</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Search Articles</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">Community Forum</h3>
                    <p className="text-sm text-muted-foreground">Connect with other users</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">Join Discussion</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Alternative Ways to Get Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (800) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@viatravels.com</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FAQSection />
        </CardContent>
      </Card>
    </div>
  );
}