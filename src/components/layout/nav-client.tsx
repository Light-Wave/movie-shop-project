"use client";

import { Menu, Search, Home, Film, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import SignInOrOut from "@/components/signin-signup-logout";
import Image from "next/image";
import Link from "next/link";
import teamDelta from "@/../public/team-delta-reversed.svg";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface NavClientProps {
    initialSession: any; // Allow passing session from server for SEO/fast boot
    cartBadge: React.ReactNode;
}

export function NavClient({ initialSession, cartBadge }: NavClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

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

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[200px] lg:w-[300px] rounded-full bg-secondary/50 border-none pl-10 focus:ring-2 focus:ring-primary/20"
                        />
                    </form>
                    <div className="flex items-center gap-2 border-l pl-4 border-muted">
                        {cartBadge}
                        <SignInOrOut />
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="flex items-center md:hidden gap-3 flex-1 justify-end">
                    <form onSubmit={handleSearch} className="relative flex-1 max-w-[200px]">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full bg-secondary/50 border-none pl-9 h-9 text-xs"
                        />
                    </form>
                    {cartBadge}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-secondary rounded-full">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l bg-background/95 backdrop-blur-xl">
                            <SheetHeader className="mb-6 text-left">
                                <SheetTitle className="flex items-center gap-2">
                                    <Image
                                        src={teamDelta}
                                        alt="Team Delta Logo"
                                        className="h-8 w-8"
                                    />
                                    <span>Navigation</span>
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex flex-col space-y-1">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-base font-medium transition-all hover:bg-secondary group"
                                    >
                                        <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span>{link.name}</span>
                                    </Link>
                                ))}

                                <div className="pt-4 mt-4 border-t">
                                    <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Account
                                    </div>
                                    <div className="px-4 py-0">
                                        <SignInOrOut
                                            orientation="vertical"
                                            containerClassName="w-full"
                                            className="w-full justify-start py-4 text-base rounded-xl"
                                        />
                                    </div>
                                </div>
                            </div>

                            {user && (
                                <div className="absolute bottom-8 left-6 right-6 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium truncate max-w-[150px]">{user.name}</span>
                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</span>
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
