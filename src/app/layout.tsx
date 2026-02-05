import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boris Halas Photography",
  description: "Professional photography portfolio of Boris Halas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <div className="flex h-screen w-screen items-center bg-white">
          <div className="flex h-[70vh] w-full md:h-[55vh]">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
