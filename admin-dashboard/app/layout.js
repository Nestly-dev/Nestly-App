// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContextProvider } from "@/components/ui/use-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Via Dashboard",
  description: "Hotel management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContextProvider>
          {children}
        </ToastContextProvider>
      </body>
    </html>
  );
}