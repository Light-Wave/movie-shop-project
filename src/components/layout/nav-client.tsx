"use client";

import { Menu, Search, Home, Film, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import SignInOrOut from "@/components/signin-signup-logout";
import Image from "next/image";
import Link from "next/link";
import teamDelta from "@/../public/team-delta-reversed.svg";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavClientProps {
  cartBadge: React.ReactNode;
}

export function NavClient({ initialSession, cartBadge }: NavClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [activeTab, setActiveTab] = useState<string>("Home");

    // Use client hook for real-time updates (e.g. after login/logout), 
    // but use initialData from server to prevent flickering.
    const { data: session, isPending } = authClient.useSession();

    // Use the most up-to-date session: 
    // If client is loading, use server data. 
    // If client is done, use client data (even if null).
    const currentSession = isPending ? initialSession : session;
    const user = currentSession?.user;
    const isAdmin = (user as any)?.role === "admin";

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Movies", href: "/browse", icon: Film },
    ];

    if (user) {
        if (isAdmin) {
            navLinks.push({ name: "Admin Dashboard", href: "/admin", icon: LayoutDashboard });
        } else {
            navLinks.push({ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard });
        }
    }
    navLinks.push({
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    });
  }

  // Handle search submission
  const handleSearch = (e: React.FormEvent | string) => {
    const query = typeof e === "string" ? e : searchQuery;
    if (typeof e !== "string") e.preventDefault();

    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/browse");
    }
  };

    // Update activeTab and document title based on current route (reactive to client navigation)
    useEffect(() => {
        // Find the best matching navLink for the current path
        let matchedLink = navLinks.find(link => link.href === pathname);
        if (!matchedLink) {
            // Try partial match for nested routes
            matchedLink = navLinks.find(link => pathname.startsWith(link.href) && link.href !== "/");
        }
        const tabName = matchedLink ? matchedLink.name : "Home";
        setActiveTab(tabName);
        document.title = `${tabName} | Movie Shop`;
    }, [navLinks, pathname]);

    // Handle search submission
    const handleSearch = (e: React.FormEvent | string) => {
        const query = typeof e === 'string' ? e : searchQuery;
        if (typeof e !== 'string') e.preventDefault();

        if (query.trim()) {
            router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
        } else {
            router.push('/browse');
        }
    };

    // Keep search input in sync with URL search param if it changes elsewhere
    useEffect(() => {
        const search = searchParams.get("search");
        if (search !== null) {
            setSearchQuery(search);
        }
    }, [searchParams]);

    return (
        <header className="m-auto w-full sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/60 flex flex-row justify-center items-center transition-all duration-300">
            <div className="container w-11/12 md:w-9/10 flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Image
                            src={teamDelta}
                            alt="Team Delta Logo"
                            className="h-10 w-10 md:h-12 md:w-12"
                        />
                        <span className="hidden sm:inline text-xl font-bold tracking-tight">Team Delta</span>
                    </Link>
                </div>
              </div>

              {user && (
                <div className="absolute bottom-8 left-6 right-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium truncate max-w-[150px]">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
