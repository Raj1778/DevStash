import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingDockDemo } from "@/components/dock";
import Navbar from "@/components/Navbar";
import MobileSidebar from "@/components/MobileSidebar";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata = {
  title: "DevStash - Developer Portfolio & Productivity Hub",
  description: "A comprehensive developer portfolio and productivity platform featuring GitHub integration, LeetCode tracking, blog management, and project showcase.",
  keywords: "developer, portfolio, github, leetcode, blog, projects, productivity, coding, programming",
  authors: [{ name: "DevStash Team" }],
  openGraph: {
    title: "DevStash - Developer Portfolio & Productivity Hub",
    description: "A comprehensive developer portfolio and productivity platform featuring GitHub integration, LeetCode tracking, blog management, and project showcase.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevStash - Developer Portfolio & Productivity Hub",
    description: "A comprehensive developer portfolio and productivity platform featuring GitHub integration, LeetCode tracking, blog management, and project showcase.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://leetcode.com" />
        
        {/* DNS prefetch for additional performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://leetcode.com" />
        
        {/* Prefetch critical pages */}
        <link rel="prefetch" href="/blog" />
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/Notes" />
        <link rel="prefetch" href="/createBlog" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <PerformanceMonitor />
        <Navbar />
        <MobileSidebar />
        {/* Page Content */}
        <div className="min-h-screen flex flex-col">{children}</div>
        {/* Floating Dock (always visible, fixed at bottom) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <FloatingDockDemo />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
