import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://invictus-digital-website.vercel.app"),

  title: "Invictus Digital | Growth Systems for Landscaping Companies",

  description:
    "Premium websites, Local SEO and AI Visibility for ambitious landscaping companies across the United States.",

  keywords: [
    "Landscaping SEO",
    "Landscaping Website Design",
    "Google Business Profile",
    "AI Visibility",
    "Local SEO",
    "Lead Generation",
    "Growth System",
  ],

  openGraph: {
    title: "Invictus Digital",
    description:
      "Build. Rank. Grow. Premium growth systems for landscaping companies.",
    url: "https://invictus-digital-website.vercel.app",
    siteName: "Invictus Digital",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Invictus Digital",
    description:
      "Premium websites, Local SEO and AI Visibility.",
  },

  icons: {
    icon: "/invictus-icon.svg",
    shortcut: "/invictus-icon.svg",
    apple: "/invictus-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#050505] text-white">
        {children}
      </body>
    </html>
  );
}