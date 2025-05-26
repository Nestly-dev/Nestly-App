// app/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BedDouble, Lock, Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    setFormError("");
    
    // Simulate login API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo purposes, any login works
      router.push("/dashboard");
      
      // In a real application, you would validate credentials with a server:
      /*
      fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          router.push('/dashboard');
        } else {
          setFormError(data.message || 'Invalid credentials');
        }
      })
      .catch(err => {
        setFormError('Login failed. Please try again.');
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
      */
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#1995AD] rounded-full flex items-center justify-center mb-4 shadow-lg">
            <BedDouble className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1995AD]">Hotel Manager</h1>
          <p className="text-[#1995AD] mt-2 text-lg">Sign in to access your dashboard</p>
        </div>
        
        {/* Login Card */}
        <Card className="w-full border-none shadow-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-[#1995AD] to-blue-600"></div>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-[#1995AD]">Sign In</CardTitle>
            <CardDescription className="text-[#1995AD]">
              Enter your credentials to access your account
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
                <Label htmlFor="email" className="text-[#02090a] font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1995AD] h-5 w-5" />
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 py-6 bg-blue-50 border-[#869b9f] focus:border-[#1995AD] focus:ring-[#1995AD] text-[#111212] placeholder:text-[#1995AD]"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
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
                    Sign in <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-5 pt-0">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-[#1995AD] font-medium">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="w-full border-blue-300 text-[#ffffff] hover:bg-[#1995AD] hover:border-blue-400 font-medium py-6">
                <svg className="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full border-blue-300 text-[#ffffff] hover:bg-[#1995AD] hover:border-blue-400 font-medium py-6">
                <svg className="mr-2 h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z"></path>
                </svg>
                Apple
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-[#1995AD]">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-[#1995AD] hover:text-[#1995AD] underline">
              Contact us to get started
            </Link>
          </p>
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-blue-700">
        <p>© 2025 Hotel Manager. All rights reserved.</p>
      </div>
    </div>
  );
}