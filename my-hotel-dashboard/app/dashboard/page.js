"use client";

import React, { useState } from 'react';
import axios from 'axios';

const Plus = () => <span>+</span>;
const Image = () => <span>🖼️</span>;
const Video = () => <span>🎥</span>;
const Building = () => <span>🏢</span>;
const Users = () => <span>👥</span>;
const DollarSign = () => <span>💲</span>;
const Camera = () => <span>📷</span>;
const FileText = () => <span>📄</span>;

const HotelDashboard = () => {





  const [activeTab, setActiveTab] = useState('hotel-registration');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    // Hotel Registration
    name: '',
    shortDescription: '',
    longDescription: '',
    starRating: '',
    propertyType: '',
    builtYear: '',
    lastRenovationYear: '',
    category: '',
    streetAddress: '',
    city: '',
    state: '',
    province: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    mapUrl: '',
    checkInTime: '',
    checkOutTime: '',
    cancellationPolicy: '',
    paymentOptions: [],
    menuDownloadUrl: '',
    sponsored: false,
    status: 'active',
    phoneNumber: '',
    email: '',
    businessWebsite: '',
    businessEmail: '',
    businessContact: '',
    businessContactMobile: '',
    bankName: '',
    accountNumber: '',
    
    // Room Registration
    roomType: '',
    roomDescription: '',
    maxOccupancy: '',
    numBeds: '',
    roomSize: '',
    totalRooms: '',
    availableRooms: '',
    
    // Room Pricing
    basePrice: '',
    currency: 'USD',
    taxPercentage: '',
    childPolicy: '',
    
    // Media Upload
    mediaType: 'photo',
    mediaCategory: 'gallery',
    mediaFile: null,
    
    // Hotel Post
    postCaption: '',
    postDescription: '',
    postMedia: null,
    
    // Reel Upload
    reelCaption: '',
    reelDescription: '',
    reelFile: null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const registrationUrl = 'http://localhost:3000/api/v1/hotels/register';
    const roomRegistrationUrl = 'http://localhost:3000/api/v1/hotels/rooms/register/:hotelId';
    const roomPricingUrl = 'http://localhost:3000/api/v1//hotels/availability/roomPricing/:roomTypeId';
    const mediaUploadUrl = 'http://localhost:3000/api/v1//hotels/Media/upload/:hotelId';
    const hotelPostUrl = 'http://localhost:3000/api/v1/hotels/posts/upload/:hotelId';
    const reelUploadUrl = 'http://localhost:3000/api/v1/content/videos/upload/:hotelId';

    const hotetFormData = {
        "name": name,
        "short_description": shortDescription,
        "long_description": longDescription,
        "star_rating": starRating,
         "property_type": propertyType,
        "built_year": builtYear,
        "last_renovation_year": lastRenovationYear,
        "category": category,
        "street_address": streetAddress,
        "city": city,
        "state": state,
        "province": province,
        "country": country,
        "postal_code": postalCode,
        "latitude": latitude,
        "longitude":longitude,
        "map_url": mapUrl,
        "total_rooms": totalRooms,
        "cancellation_policy": cancellationPolicy,
        "payment_options": paymentOptions,
        "menu_download_url": menuDownloadUrl,
        "sponsored": sponsored,
        "status": status,
         }
    const roomFormData = {
        "type": roomType,
        "description": roomDescription,
        "max_occupancy": maxOccupancy,
        "num_beds": numBeds,
        "room_size": roomSize,
        "total_inventory": totalRooms,
        "available_inventory": availableRooms
    }
    const roomPricingFormData = {
        "roomFee": basePrice,
        "serviceFee": 0,
        "currency": currency,
        "tax_percentage": taxPercentage,
        "child_policy": childPolicy
    }
    const mediaUploadFormData = {
        "media_type": mediaType,
        "media_category": mediaCategory,
        "media": mediaFile,
    }
    const hotelPostFormData = {
        "caption": postCaption,
        "postDescription": postDescription,
        "media": postMedia,
    }
    const reelUploadFormData = {
        "title": reelCaption,
        "description": reelDescription,
        "video": reelFile
    }
    axios.post(registrationUrl, hotetFormData)
  };

  const tabs = [
    { id: 'hotel-registration', label: 'Hotel Registration', icon: Building },
    { id: 'room-registration', label: 'Room Registration', icon: Users },
    { id: 'room-pricing', label: 'Room Pricing', icon: DollarSign },
    { id: 'media-upload', label: 'Media Upload', icon: Image },
    { id: 'hotel-post', label: 'Hotel Post', icon: FileText },
    { id: 'reel-uploads', label: 'Reel Uploads', icon: Video }
  ];

  const paymentOptionsList = ['Visa', 'MasterCard', 'Momo', 'Irembo'];
  const roomTypesList = ['single', 'double', 'king', 'suite', 'deluxe'];
  const mediaTypesList = ['photo', 'video'];
  const mediaCategoriesList = ['landscape', 'portrait', 'profile', 'room', 'gallery', 'sponsored', 'virtualTours'];

  const renderSearchBar = () => {
    if (activeTab === 'hotel-registration') return null;
    
    return (
      <div className="mb-6">
        <div className="relative">
          <h1 className="text-2xl font-bold text-black mb-4 flex items-center">Search</h1>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>
      </div>
    );
  };

  const renderHotelRegistration = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg text-black font-semibold mb-4 flex items-center">
          Basic Hotel Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
            <select
              value={formData.starRating}
              onChange={(e) => handleInputChange('starRating', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              value={formData.propertyType}
              onChange={(e) => handleInputChange('propertyType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">Select Type</option>
              <option value="hotel">Hotel</option>
              <option value="resort">Resort</option>
              <option value="motel">Motel</option>
              <option value="boutique">Boutique Hotel</option>
              <option value="business">Business Hotel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Built Year</label>
            <input
              type="number"
              value={formData.builtYear}
              onChange={(e) => handleInputChange('builtYear', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Renovation Year</label>
            <input
              type="number"
              value={formData.lastRenovationYear}
              onChange={(e) => handleInputChange('lastRenovationYear', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
          <textarea
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
          <textarea
            value={formData.longDescription}
            onChange={(e) => handleInputChange('longDescription', e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Location Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) => handleInputChange('streetAddress', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => handleInputChange('province', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
            <input
              type="text"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => handleInputChange('latitude', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => handleInputChange('longitude', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Map URL</label>
            <input
              type="url"
              value={formData.mapUrl}
              onChange={(e) => handleInputChange('mapUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Policies & Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time *</label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) => handleInputChange('checkInTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time *</label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
            <textarea
              value={formData.cancellationPolicy}
              onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Options</label>
            <div className="flex flex-wrap gap-2 text-black">
              {paymentOptionsList.map(option => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.paymentOptions.includes(option)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleInputChange('paymentOptions', [...formData.paymentOptions, option]);
                      } else {
                        handleInputChange('paymentOptions', formData.paymentOptions.filter(p => p !== option));
                      }
                    }}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Download URL</label>
            <input
              type="url"
              value={formData.menuDownloadUrl}
              onChange={(e) => handleInputChange('menuDownloadUrl', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                checked={formData.sponsored}
                onChange={(e) => handleInputChange('sponsored', e.target.checked)}
                className="mr-2"
              />
              Sponsored Hotel
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md ">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black ">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Website</label>
            <input
              type="url"
              value={formData.businessWebsite}
              onChange={(e) => handleInputChange('businessWebsite', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
            <input
              type="email"
              value={formData.businessEmail}
              onChange={(e) => handleInputChange('businessEmail', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Contact</label>
            <input
              type="text"
              value={formData.businessContact}
              onChange={(e) => handleInputChange('businessContact', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Contact Mobile</label>
            <input
              type="tel"
              value={formData.businessContactMobile}
              onChange={(e) => handleInputChange('businessContactMobile', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
            <input
              type="text"
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoomRegistration = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Room Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
            <select
              value={formData.roomType}
              onChange={(e) => handleInputChange('roomType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypesList.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy *</label>
            <input
              type="number"
              value={formData.maxOccupancy}
              onChange={(e) => handleInputChange('maxOccupancy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Beds *</label>
            <input
              type="number"
              value={formData.numBeds}
              onChange={(e) => handleInputChange('numBeds', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Size (sq ft)</label>
            <input
              type="number"
              value={formData.roomSize}
              onChange={(e) => handleInputChange('roomSize', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Rooms *</label>
            <input
              type="number"
              value={formData.totalRooms}
              onChange={(e) => handleInputChange('totalRooms', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Available Rooms</label>
            <input
              type="number"
              value={formData.availableRooms}
              onChange={(e) => handleInputChange('availableRooms', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Description</label>
            <textarea
              value={formData.roomDescription}
              onChange={(e) => handleInputChange('roomDescription', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoomPricing = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Pricing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Price *</label>
            <input
              type="number"
              step="0.01"
              value={formData.basePrice}
              onChange={(e) => handleInputChange('basePrice', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RWF">RWF</option>
              <option value="KES">KES</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Percentage</label>
            <input
              type="number"
              step="0.01"
              value={formData.taxPercentage}
              onChange={(e) => handleInputChange('taxPercentage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Child Policy</label>
            <textarea
              value={formData.childPolicy}
              onChange={(e) => handleInputChange('childPolicy', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Describe your child policy..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderMediaUpload = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Media Upload
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
            <select
              value={formData.mediaType}
              onChange={(e) => handleInputChange('mediaType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              {mediaTypesList.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Media Category</label>
            <select
              value={formData.mediaCategory}
              onChange={(e) => handleInputChange('mediaCategory', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              {mediaCategoriesList.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept={formData.mediaType === 'photo' ? 'image/*' : 'video/*'}
                onChange={(e) => handleFileUpload('mediaFile', e.target.files[0])}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  {formData.mediaType === 'photo' ? (
                    <Image className="w-12 h-12 text-gray-400 mb-2" />
                  ) : (
                    <Video className="w-12 h-12 text-gray-400 mb-2" />
                  )}
                  <p className="text-gray-500">Click to upload {formData.mediaType}</p>
                  {formData.mediaFile && (
                    <p className="text-sm text-green-600 mt-2">Selected: {formData.mediaFile.name}</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHotelPost = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Hotel Post
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Caption *</label>
            <input
              type="text"
              value={formData.postCaption}
              onChange={(e) => handleInputChange('postCaption', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter post caption..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Post Description *</label>
            <textarea
              value={formData.postDescription}
              onChange={(e) => handleInputChange('postDescription', e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Describe your post..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Media</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload('postMedia', e.target.files[0])}
                className="hidden"
                id="post-media-upload"
              />
              <label htmlFor="post-media-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Camera className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Click to upload image or video</p>
                  {formData.postMedia && (
                    <p className="text-sm text-green-600 mt-2">Selected: {formData.postMedia.name}</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReelUploads = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
          Reel Upload
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reel Caption *</label>
            <input
              type="text"
              value={formData.reelCaption}
              onChange={(e) => handleInputChange('reelCaption', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Enter reel caption..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reel Description</label>
            <textarea
              value={formData.reelDescription}
              onChange={(e) => handleInputChange('reelDescription', e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Describe your reel..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Reel Video *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileUpload('reelFile', e.target.files[0])}
                className="hidden"
                id="reel-upload"
              />
              <label htmlFor="reel-upload" className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <Video className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">Click to upload video reel</p>
                  <p className="text-xs text-gray-400 mt-1">Recommended: Vertical video (9:16 ratio)</p>
                  {formData.reelFile && (
                    <p className="text-sm text-green-600 mt-2">Selected: {formData.reelFile.name}</p>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hotel-registration':
        return renderHotelRegistration();
      case 'room-registration':
        return renderRoomRegistration();
      case 'room-pricing':
        return renderRoomPricing();
      case 'media-upload':
        return renderMediaUpload();
      case 'hotel-post':
        return renderHotelPost();
      case 'reel-uploads':
        return renderReelUploads();
      default:
        return renderHotelRegistration();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hotel Management Dashboard</h1>
              <p className="text-sm text-gray-600">Manage your hotel registration and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Save {tabs.find(t => t.id === activeTab)?.label}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Hotels</span>
                  <span className="font-medium text-black">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Rooms</span>
                  <span className="font-medium text-black">247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Media Files</span>
                  <span className="font-medium text-black">89</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Posts</span>
                  <span className="font-medium text-black">34</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderSearchBar()}
            
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {activeTab === 'hotel-registration' && 'Register a new hotel with all required information'}
                  {activeTab === 'room-registration' && 'Add and manage room types and details'}
                  {activeTab === 'room-pricing' && 'Set pricing information for different room types'}
                  {activeTab === 'media-upload' && 'Upload photos and videos for your hotel gallery'}
                  {activeTab === 'hotel-post' && 'Create engaging posts about your hotel'}
                  {activeTab === 'reel-uploads' && 'Upload video reels to showcase your hotel'}
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {renderTabContent()}
                  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
                      onClick={handleSubmit}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Save {tabs.find(t => t.id === activeTab)?.label}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDashboard;