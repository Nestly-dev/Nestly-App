// app/forgot-password/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BedDouble, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      setFormError("Please enter your email address");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setFormError("");
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // In a real application, you would make an API call:
      /*
      fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setIsSubmitted(true);
        } else {
          setFormError(data.message || 'Failed to send reset email');
        }
      })
      .catch(err => {
        setFormError('Something went wrong. Please try again.');
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
          <p className="text-[#1995AD] mt-2 text-lg">Password Recovery</p>
        </div>
        
        {/* Forgot Password Card */}
        <Card className="w-full border-none shadow-xl overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 text-[#1995AD] to-purple-600"></div>
          
          {!isSubmitted ? (
            <>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-blue-900">Forgot Password</CardTitle>
                <CardDescription className="text-[#1995AD]">
                  Enter your email to receive a password reset link
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
                    <Label htmlFor="email" className="text-[#1995AD] font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1995AD] h-5 w-5" />
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 py-6 bg-blue-50 border-blue-200 focus:border-blue-500 focus:ring-blue-500 text-blue-900 placeholder:text-[#1995AD]"
                        value={email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <p className="text-sm text-[#1995AD] mt-1">
                      We'll send a link to this email to reset your password
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full py-6 bg-gradient-to-r from-[#1995AD] to-[#1995AD] hover:from-[#106070] hover:to-[#126778] text-white text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl font-bold text-blue-900">Check Your Email</CardTitle>
                <CardDescription className="text-[#1995AD]">
                  We've sent a password recovery link to your email
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-[#1995AD]">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold text-[#1995AD]">{email}</p>
                  <p className="text-[#1995AD] text-sm mt-3">
                    Please check your email and click on the link to reset your password. 
                    The link will expire in 30 minutes.
                  </p>
                </div>
                
                <div className="mt-2 text-[#1995AD] text-sm">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <Button 
                    variant="link" 
                    className="text-[#1995AD] font-semibold" 
                    onClick={() => setIsSubmitted(false)}
                  >
                    try again with a different email
                  </Button>
                </div>
              </CardContent>
            </>
          )}
          
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-[#1995AD] hover:text-[#65c0d2] hover:bg-blue-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4 text-[#1995AD]" />
                Back to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-blue-700">
        <p>© 2025 Hotel Manager. All rights reserved.</p>
      </div>
    </div>
  );
}