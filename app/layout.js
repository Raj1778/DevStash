import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingDockDemo } from "@/components/dock";
import MobileSidebar from "@/components/MobileSidebar";
import Navbar from "@/components/Navbar";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

// Optimize font loading with display swap and preload
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: "DevStash - Developer Portfolio & Productivity Hub",
  description: "A modern developer portfolio and productivity hub for tracking GitHub commits, LeetCode progress, and sharing technical blogs.",
  keywords: ["developer", "portfolio", "github", "leetcode", "blog", "productivity"],
  authors: [{ name: "DevStash Team" }],
  creator: "DevStash",
  publisher: "DevStash",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://devstash.vercel.app'),
  openGraph: {
    title: "DevStash - Developer Portfolio & Productivity Hub",
    description: "Track your GitHub commits, LeetCode progress, and share technical insights",
    url: 'https://devstash.vercel.app',
    siteName: 'DevStash',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "DevStash - Developer Portfolio & Productivity Hub",
    description: "Track your GitHub commits, LeetCode progress, and share technical insights",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external APIs */}
        <link rel="dns-prefetch" href="//api.github.com" />
        <link rel="dns-prefetch" href="//leetcode.com" />
        
        {/* Preload critical pages */}
        <link rel="prefetch" href="/projects" />
        <link rel="prefetch" href="/my-account" />
        <link rel="prefetch" href="/createBlog" />
      </head>
      <body className="antialiased bg-[#0a0a0a]">
        <PerformanceMonitor />
        <Navbar />
        <MobileSidebar />
        {/* Page Content */}
        <div className="min-h-screen flex flex-col">{children}</div>
        {/* Floating Dock (always visible, fixed at bottom) */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <FloatingDockDemo />
        </div>
      </body>
    </html>
  );
}
