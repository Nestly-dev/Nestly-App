// components/dashboard/SupportForm.jsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PaperclipIcon, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const SupportForm = () => {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    files: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({
      ...formData,
      files: selectedFiles,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.subject) {
      setNotification({
        type: "error",
        title: "Missing information",
        description: "Please enter a subject for your ticket.",
      });
      return;
    }
    
    if (!formData.category) {
      setNotification({
        type: "error",
        title: "Missing information",
        description: "Please select a category for your ticket.",
      });
      return;
    }
    
    if (!formData.priority) {
      setNotification({
        type: "error",
        title: "Missing information",
        description: "Please select a priority level.",
      });
      return;
    }
    
    if (!formData.description) {
      setNotification({
        type: "error",
        title: "Missing information",
        description: "Please provide a description of your issue.",
      });
      return;
    }
    
    // Submit form
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show success message
      setNotification({
        type: "success",
        title: "Ticket created successfully",
        description: "Your support ticket has been submitted. We'll get back to you shortly.",
      });
      
      // Reset form
      setFormData({
        subject: "",
        category: "",
        priority: "",
        description: "",
        files: [],
      });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {notification && (
        <div className={`p-4 mb-4 rounded-md ${
          notification.type === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                notification.type === "success" ? "text-green-800" : "text-red-800"
              }`}>
                {notification.title}
              </h3>
              <div className={`mt-1 text-sm ${
                notification.type === "success" ? "text-green-700" : "text-red-700"
              }`}>
                <p>{notification.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Briefly describe your issue"
          value={formData.subject}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleSelectChange("category", value)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="account">Account</SelectItem>
            <SelectItem value="billing">Billing</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="booking">Booking System</SelectItem>
            <SelectItem value="reporting">Reporting</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => handleSelectChange("priority", value)}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Please describe your issue in detail..."
          rows={5}
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments (optional)</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById("file-upload").click()}
          >
            <PaperclipIcon className="h-4 w-4 mr-2" />
            Attach Files
          </Button>
          <Input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-sm text-muted-foreground">
            {formData.files.length > 0
              ? `${formData.files.length} file(s) selected`
              : "No files selected"}
          </span>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Ticket
          </>
        )}
      </Button>
    </form>
  );
};

export default SupportForm;