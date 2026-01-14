// app/page.jsx - Hotel ID Login
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BedDouble, Lock, Building2, ArrowRight, Key } from "lucide-react";

export default function HotelLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    hotel_id: "",
    password: "",
    rememberMe: false,
  });
  const [formError, setFormError] = useState("");
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (checked) => {
    setFormData({
      ...formData,
      rememberMe: checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.hotel_id || !formData.password) {
      setFormError("Please enter both Hotel ID and password");
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const { apiClient } = await import('@/lib/apiClient');

      // Use hotel-specific login
      await apiClient.hotelAuth.login(formData.hotel_id, formData.password);

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (error) {
      console.error('Login error:', error);
      setFormError(error.message || 'Invalid Hotel ID or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1995AD] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <BedDouble className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1995AD]">Nestly Hotel</h1>
          <p className="text-[#1995AD] mt-2 text-lg">Hotel Management Dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="w-full border-none shadow-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-[#1995AD] to-blue-600"></div>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-[#1995AD]">Hotel Login</CardTitle>
            <CardDescription className="text-[#1995AD]">
              Enter your unique Hotel ID and password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {formError && (
                <div className="p-3 text-sm bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  {formError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="hotel_id" className="text-[#02090a] font-medium flex items-center gap-2">
                  <Building2 size={16} />
                  Hotel ID
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1995AD] h-5 w-5" />
                  <Input
                    id="hotel_id"
                    name="hotel_id"
                    type="text"
                    placeholder="Enter your Hotel ID (UUID)"
                    className="pl-10 py-6 bg-blue-50 border-[#869b9f] focus:border-[#1995AD] focus:ring-[#1995AD] text-[#111212] placeholder:text-gray-400 font-mono text-sm"
                    value={formData.hotel_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">Your unique hotel identifier (e.g., 550e8400-e29b-41d4-a716-446655440000)</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-[#041316] font-medium">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#1995AD] hover:text-[#1995AD] font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1995AD] h-5 w-5" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 py-6 bg-blue-50 border-blue-200 focus:border-[#1995AD] focus:ring-[#1995AD] text-[#000000]"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                  className="data-[state=checked]:bg-[#1995AD] border-[#1995AD]"
                />
                <Label
                  htmlFor="remember"
                  className="text-[#0e5461] font-medium cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full py-6 bg-gradient-to-r from-[#1995AD] to-[#1995AD] hover:from-[#1995AD] hover:to-[#1995AD] text-white text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    Access Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-0">
            <div className="w-full p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-[#1995AD] font-medium mb-2">🔒 Secure Hotel Access</p>
              <p className="text-xs text-gray-600">
                Each hotel has a unique ID. You can only view and manage data specific to your hotel.
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Help Link */}
        <div className="text-center">
          <p className="text-[#1995AD] text-sm">
            Need your Hotel ID?{" "}
            <Link href="/contact" className="font-semibold text-[#1995AD] hover:text-[#1995AD] underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-blue-700">
        <p className="text-sm">© 2025 Nestly Hotel Management. All rights reserved.</p>
      </div>
    </div>
  );
}
