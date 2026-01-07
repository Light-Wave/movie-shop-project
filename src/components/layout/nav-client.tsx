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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import CartBadge from "../cartComponents/cartBadge";
import { getMovieSuggestions } from "@/server-actions/movie/search-movies";
import { generateMovieUrl } from "@/components/sharedutils/slug-utils";

type MovieSuggestion = {
  id: string;
  title: string;
};

export function NavClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isAdmin = user?.role === "admin";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Debounce search suggestions
  useEffect(() => {
    setActiveIndex(-1);
    if (searchQuery.trim().length > 1) {
      const handler = setTimeout(async () => {
        const result = await getMovieSuggestions(searchQuery);
        setSuggestions(result);
        setShowSuggestions(true);
      }, 300); // 300ms debounce delay

      return () => {
        clearTimeout(handler);
      };
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

    // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);


  const navLinks = useMemo(() => {
    const links = [
      { name: "Home", href: "/", icon: Home },
      { name: "Movies", href: "/browse", icon: Film },
    ];

    // Only add authenticated links after mounting to avoid hydration mismatch
    if (isMounted && user) {
      if (isAdmin) {
        links.push({
          name: "Admin",
          href: "/admin",
          icon: LayoutDashboard,
        });
      }
      links.push({
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      });
    }
    return links;
  }, [isMounted, user, isAdmin]);

  const [activeTab, setActiveTab] = useState<string>("Home");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If a suggestion is selected with arrow keys, navigate to it
    if (activeIndex >= 0 && activeIndex < suggestions.length) {
      const selectedMovie = suggestions[activeIndex];
      handleSuggestionClick(selectedMovie);
      return;
    }

    // Otherwise, perform a general search
    const query = searchQuery;
    setShowSuggestions(false);
    setSearchQuery("");
    setActiveIndex(-1);

    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  const handleSuggestionClick = (movie: MovieSuggestion) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setActiveIndex(-1);
    router.push(generateMovieUrl(movie.id, movie.title));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex >= suggestions.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex <= 0 ? suggestions.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
    // Let the form's onSubmit handle the Enter key
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
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={teamDelta}
              alt="Team Delta Logo"
              className="h-10 w-10 md:h-12 md:w-12"
            />
            <span className="hidden sm:inline text-xl font-bold tracking-tight">
              Team Delta
            </span>
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
          <div ref={searchContainerRef} className="relative">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className="w-[200px] lg:w-[300px] rounded-full bg-secondary/50 border-none pl-10 focus:ring-2 focus:ring-primary/20"
                autoComplete="off"
              />
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-10">
                <ul>
                  {suggestions.map((movie, index) => (
                    <li key={movie.id}
                        className={index === activeIndex ? "bg-secondary" : ""}
                        onMouseEnter={() => setActiveIndex(index)}
                    >
                      <button
                        type="button"
                        onMouseDown={() => handleSuggestionClick(movie)}
                        className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary"
                      >
                        {movie.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 border-l pl-4 border-muted">
            <CartBadge />
            <SignInOrOut />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden gap-3 flex-1 justify-end">
          <div ref={searchContainerRef} className="relative flex-1 max-w-[200px]">
            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className="w-full rounded-full bg-secondary/50 border-none pl-9 h-9 text-xs"
                autoComplete="off"
              />
            </form>
            {showSuggestions && suggestions.length > 0 && (
                 <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg z-10">
                 <ul>
                    {suggestions.map((movie, index) => (
                        <li key={movie.id}
                            className={index === activeIndex ? "bg-secondary" : ""}
                            onMouseEnter={() => setActiveIndex(index)}
                        >
                        <button
                            type="button"
                            onMouseDown={() => handleSuggestionClick(movie)}
                            className="w-full text-left block px-4 py-2 text-sm hover:bg-secondary"
                        >
                            {movie.title}
                        </button>
                        </li>
                  ))}
                 </ul>
               </div>
            )}
          </div>
          <CartBadge />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary rounded-full"
                aria-controls="nav-sheet"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              id="nav-sheet"
              side="right"
              className="w-[300px] sm:w-[350px] border-l bg-background/95 backdrop-blur-xl"
            >
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
