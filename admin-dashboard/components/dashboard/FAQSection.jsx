// components/dashboard/FAQSection.jsx
"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// FAQ data
const faqData = [
  {
    id: "faq-1",
    question: "How do I update room availability?",
    answer: "You can update room availability by navigating to the 'Rooms' tab in the dashboard. Select the room type you want to update, then click on 'Manage Rooms'. From there, you can modify the availability status of individual rooms or apply changes in bulk.",
    category: "rooms"
  },
  {
    id: "faq-2",
    question: "How can I view and respond to guest reviews?",
    answer: "Guest reviews can be accessed from the 'Reviews' tab in the dashboard. You'll see all reviews listed there with options to filter by rating, date, or response status. To respond to a review, click on the reply button next to the review and type your response.",
    category: "reviews"
  },
  {
    id: "faq-3",
    question: "How do I generate reports on booking performance?",
    answer: "To generate booking performance reports, go to the 'Overview' dashboard and click on the 'Reports' section. From there, you can select the type of report you want to generate, set the date range, and choose specific metrics to include. Reports can be viewed online or exported in various formats.",
    category: "bookings"
  },
  {
    id: "faq-4",
    question: "How do I upload new photos to my hotel gallery?",
    answer: "To add new photos to your hotel gallery, go to the 'Gallery' tab and click on the 'Add Media' button. You can upload photos individually or in bulk. Once uploaded, you can organize them into different categories, add captions, and set the display order.",
    category: "gallery"
  },
  {
    id: "faq-5",
    question: "How can I set up seasonal pricing for my rooms?",
    answer: "To set up seasonal pricing, navigate to the 'Rooms' tab, then select 'Pricing' from the sub-menu. Click on 'Seasonal Pricing' and then 'Add Season'. Define the date range for your season, adjust prices for each room type, and save your changes. You can create multiple seasons with different pricing rules.",
    category: "rooms"
  },
  {
    id: "faq-6",
    question: "How do I export my booking data to my accounting system?",
    answer: "You can export booking data by going to the 'Bookings' tab and clicking on 'Export'. Select the date range for the data you want to export, choose the format compatible with your accounting system (CSV, Excel, etc.), and click 'Generate Export'. You can then download the file and import it into your accounting system.",
    category: "bookings"
  },
  {
    id: "faq-7",
    question: "How do I set up notification preferences?",
    answer: "To customize your notification settings, click on your profile icon in the top-right corner and select 'Account Settings'. Navigate to the 'Notifications' tab where you can choose which events trigger notifications and how you want to receive them (email, SMS, in-app).",
    category: "account"
  },
  {
    id: "faq-8",
    question: "What should I do if I can't access my dashboard?",
    answer: "If you're having trouble accessing your dashboard, first check your internet connection and try refreshing the page. If the issue persists, try clearing your browser cache or using a different browser. If you still can't access the dashboard, contact our support team through the alternative methods listed on the support page.",
    category: "account"
  },
  {
    id: "faq-9",
    question: "How do I manage special offers and promotions?",
    answer: "To create and manage special offers, go to the 'Rooms' tab and select 'Pricing', then click on 'Special Offers'. From here, you can create new promotions, set discount amounts, specify valid date ranges, and define eligibility criteria. Active promotions will automatically be applied to qualifying bookings.",
    category: "rooms"
  },
  {
    id: "faq-10",
    question: "How can I track the performance of my hotel's media content?",
    answer: "Media performance analytics are available in the 'Gallery' section. Click on 'Media Analytics' to view metrics such as views, engagement rates, and popularity rankings for your photos and videos. You can filter the data by date range, media type, or category to gain more specific insights.",
    category: "gallery"
  }
];