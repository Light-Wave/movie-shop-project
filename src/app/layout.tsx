import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Nav } from "./navigation";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Team Delta Movie Shop",
  description: "Team Delta, movie shop project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} font-sans bg-zinc-50 dark:bg-black dark:text-white`}
      >
        <Nav />
        <div className="sm:w-9/10 lg:w-full m-auto min-h-screen flex flex-col">
          <main className="flex-1 px-2 sm:px-6 lg:px-8 pt-1 lg:pt-10 pb-4">
            {children}
          </main>
        </div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
