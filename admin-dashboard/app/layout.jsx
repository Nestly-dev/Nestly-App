// app/layout.js
import "./globals.css";
import { ToastContextProvider } from "@/components/ui/use-toast";
import { AuthProvider } from "@/contexts/AuthContext";

// Remove the Google Fonts import and use system fonts instead
const fontClass = "font-sans"; // Using the system font stack from Tailwind

export const metadata = {
  title: "Via Dashboard",
  description: "Hotel management dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={fontClass}>
        <AuthProvider>
          <ToastContextProvider>
            {children}
          </ToastContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}