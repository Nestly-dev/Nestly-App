// components/dashboard/RoomPricing.jsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  Edit, 
  Plus, 
  Calendar,
  Percent,
  DollarSign,
  BadgePercent,
  TrendingUp,
  Settings
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Sample room pricing data
const pricingData = [
  {
    id: 1,
    roomType: "Standard Room",
    basePrice: 120,
    weekendRate: 150,
    holidayRate: 180,
    currency: "USD",
    taxRate: 12,
    lastUpdated: "2025-04-01",
    specialOffers: [
      {
        id: 101,
        name: "Summer Special",
        discountPercentage: 15,
        startDate: "2025-06-01",
        endDate: "2025-08-31",
        active: true
      },
      {
        id: 102,
        name: "Early Bird",
        discountPercentage: 10,
        minDaysBeforeArrival: 30,
        active: true
      }
    ]
  },
  {
    id: 2,
    roomType: "Deluxe Room",
    basePrice: 180,
    weekendRate: 220,
    holidayRate: 250,
    currency: "USD",
    taxRate: 12,
    lastUpdated: "2025-04-02",
    specialOffers: [
      {
        id: 201,
        name: "Summer Special",
        discountPercentage: 15,
        startDate: "2025-06-01",
        endDate: "2025-08-31",
        active: true
      }
    ]
  },
  {
    id: 3,
    roomType: "Family Suite",
    basePrice: 250,
    weekendRate: 300,
    holidayRate: 350,
    currency: "USD",
    taxRate: 12,
    lastUpdated: "2025-04-03",
    specialOffers: [
      {
        id: 301,
        name: "Family Package",
        discountPercentage: 20,
        minStay: 3,
        active: true
      }
    ]
  },
  {
    id: 4,
    roomType: "Presidential Suite",
    basePrice: 500,
    weekendRate: 600,
    holidayRate: 700,
    currency: "USD",
    taxRate: 12,
    lastUpdated: "2025-04-04",
    specialOffers: [
      {
        id: 401,
        name: "Luxury Experience",
        discountPercentage: 10,
        minStay: 2,
        active: true
      }
    ]
  }
];

// Sample seasonal pricing data
const seasonalPricingData = [
  {
    id: 1,
    name: "High Season",
    startDate: "2025-06-01",
    endDate: "2025-08-31",
    priceAdjustments: [
      { roomTypeId: 1, adjustmentPercentage: 20 },
      { roomTypeId: 2, adjustmentPercentage: 15 },
      { roomTypeId: 3, adjustmentPercentage: 15 },
      { roomTypeId: 4, adjustmentPercentage: 10 }
    ]
  },
  {
    id: 2,
    name: "Winter Season",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    priceAdjustments: [
      { roomTypeId: 1, adjustmentPercentage: 10 },
      { roomTypeId: 2, adjustmentPercentage: 10 },
      { roomTypeId: 3, adjustmentPercentage: 5 },
      { roomTypeId: 4, adjustmentPercentage: 5 }
    ]
  },
  {
    id: 3,
    name: "Holiday Season",
    startDate: "2025-12-20",
    endDate: "2026-01-05",
    priceAdjustments: [
      { roomTypeId: 1, adjustmentPercentage: 30 },
      { roomTypeId: 2, adjustmentPercentage: 25 },
      { roomTypeId: 3, adjustmentPercentage: 25 },
      { roomTypeId: 4, adjustmentPercentage: 20 }
    ]
  }
];

const RoomPricing = () => {
  const [pricing, setPricing] = useState(pricingData);
  const [seasonalPricing, setSeasonalPricing] = useState(seasonalPricingData);
  const [editingRoomId, setEditingRoomId] = useState(null);
  
  // Toggle editing mode for a room type
  const toggleEditing = (id) => {
    if (editingRoomId === id) {
      setEditingRoomId(null);
    } else {
      setEditingRoomId(id);
    }
  };
  
  return (
    <Tabs defaultValue="base-pricing">
      <TabsList className="mb-4">
        <TabsTrigger value="base-pricing" className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2" /> Base Pricing
        </TabsTrigger>
        <TabsTrigger value="seasonal" className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" /> Seasonal Pricing
        </TabsTrigger>
        <TabsTrigger value="special-offers" className="flex items-center">
          <BadgePercent className="h-4 w-4 mr-2" /> Special Offers
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="base-pricing">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Base Pricing by Room Type</h3>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" /> Pricing Settings
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Base Rate</TableHead>
                  <TableHead>Weekend Rate</TableHead>
                  <TableHead>Holiday Rate</TableHead>
                  <TableHead>Tax Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricing.map((price) => (
                  <TableRow key={price.id}>
                    <TableCell className="font-medium">{price.roomType}</TableCell>
                    <TableCell>
                      {editingRoomId === price.id ? (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                          <Input 
                            type="number" 
                            defaultValue={price.basePrice}
                            className="w-20 h-8"
                          />
                        </div>
                      ) : (
                        formatCurrency(price.basePrice)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRoomId === price.id ? (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                          <Input 
                            type="number" 
                            defaultValue={price.weekendRate}
                            className="w-20 h-8"
                          />
                        </div>
                      ) : (
                        formatCurrency(price.weekendRate)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRoomId === price.id ? (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                          <Input 
                            type="number" 
                            defaultValue={price.holidayRate}
                            className="w-20 h-8"
                          />
                        </div>
                      ) : (
                        formatCurrency(price.holidayRate)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRoomId === price.id ? (
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-muted-foreground mr-1" />
                          <Input 
                            type="number" 
                            defaultValue={price.taxRate}
                            className="w-20 h-8"
                          />
                        </div>
                      ) : (
                        `${price.taxRate}%`
                      )}
                    </TableCell>
                    <TableCell>{price.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      {editingRoomId === price.id ? (
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" onClick={() => toggleEditing(price.id)}>
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleEditing(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleEditing(price.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="seasonal">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Seasonal Pricing Adjustments</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Season
            </Button>
          </div>
          
          <div className="grid gap-4">
            {seasonalPricing.map((season) => (
              <Card key={season.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium">{season.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {season.startDate} to {season.endDate}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Season
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600">
                          Delete Season
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {season.priceAdjustments.map((adjustment) => {
                        const roomType = pricing.find(p => p.id === adjustment.roomTypeId);
                        if (!roomType) return null;
                        
                        const adjustedPrice = roomType.basePrice * (1 + adjustment.adjustmentPercentage / 100);
                        
                        return (
                          <div 
                            key={`${season.id}-${adjustment.roomTypeId}`}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                          >
                            <div>
                              <p className="font-medium">{roomType.roomType}</p>
                              <div className="flex items-center">
                                <TrendingUp className="h-4 w-4 text-amber-500 mr-1" />
                                <span className="text-sm text-amber-600">+{adjustment.adjustmentPercentage}%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Base: {formatCurrency(roomType.basePrice)}</p>
                              <p className="font-medium">{formatCurrency(adjustedPrice)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="special-offers">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Special Offers & Discounts</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Add Offer
            </Button>
          </div>
          
          <div className="grid gap-4">
            {pricing.map((price) => (
              <div key={price.id}>
                <h4 className="text-md font-medium mb-3">{price.roomType}</h4>
                
                {price.specialOffers.length > 0 ? (
                  <div className="space-y-3">
                    {price.specialOffers.map((offer) => (
                      <Card key={offer.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h5 className="font-medium">{offer.name}</h5>
                                {offer.active && (
                                  <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>
                                )}
                              </div>
                              <div className="mt-1">
                                <Badge variant="outline" className="mr-2">
                                  <Percent className="h-3 w-3 mr-1" /> {offer.discountPercentage}% off
                                </Badge>
                                
                                {offer.startDate && offer.endDate && (
                                  <Badge variant="outline">
                                    <Calendar className="h-3 w-3 mr-1" /> {offer.startDate} - {offer.endDate}
                                  </Badge>
                                )}
                                
                                {offer.minStay && (
                                  <Badge variant="outline">
                                    Min stay: {offer.minStay} nights
                                  </Badge>
                                )}
                                
                                {offer.minDaysBeforeArrival && (
                                  <Badge variant="outline">
                                    Book {offer.minDaysBeforeArrival}+ days in advance
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </Button>
                              {offer.active ? (
                                <Button variant="outline" size="sm">
                                  Deactivate
                                </Button>
                              ) : (
                                <Button variant="outline" size="sm">
                                  Activate
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-md text-center">
                    <p className="text-muted-foreground">No special offers for this room type</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Offer
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default RoomPricing;