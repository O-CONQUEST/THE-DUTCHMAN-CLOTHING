import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext"; // Ensure this path is correct
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Dutchman",
  description: "Sleek Fits for the Modern Voyage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}>
        <CartProvider>
          {/* Universal Navigation */}
          <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-[100]">
            <div className="flex-1">
              <Link href="/collection" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition">
                Collection
              </Link>
            </div>

            <div className="flex-shrink-0">
              <Link href="/">
                {/* LOGO FIX: Using standard <img> at the root /logo.png 
                   This is the most reliable way to ensure Vercel displays the asset.
                */}
                <img 
                  src="/logo.png" 
                  alt="LOGO" 
                  className="h-8 w-auto block mx-auto"
            
                />
              </Link>
            </div>

            <div className="flex-1 text-right space-x-6">
              <Link href="/auth" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition">
                Account
              </Link>
              <Link href="/cart" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-60 transition">
                Bag
              </Link>
            </div>
          </nav>

          {children}
        </CartProvider>
      </body>
    </html>
  );
}