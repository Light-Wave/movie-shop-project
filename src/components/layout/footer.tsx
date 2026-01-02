"use client";

import Link from "next/link";
import Image from "next/image";
import teamDelta from "@/../public/team-delta-reversed.svg";
import { authClient } from "@/lib/auth-client";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4">
          <div className="flex flex-col space-y-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={teamDelta}
                alt="Team Delta Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-bold tracking-tight">
                Team Delta
              </span>
            </Link>
            <div className="flex flex-col space-y-2">
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs md:max-w-sm">
                Purveyors of Fine Moving Pictures. Gathered from across the
                Multiverse using high-quality magic and a stubborn refusal to
                acknowledge physical laws.
              </p>
              <p className="text-[10px] text-muted-foreground/80 italic">
                * 80% genuine drama guaranteed.
              </p>
            </div>
          </div>

          {/* footer navigation */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h3>
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/browse"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Browse Movies
              </Link>
              <Link
                href="/cart"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Your Cart
              </Link>
              {user && (
                <Link
                  href="/dashboard"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Dedication and thanks */}
          <div className="flex flex-col space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Credits
            </h3>
            <div className="flex flex-col space-y-2">
              <div className="">
                <p className="text-[12px] text-muted-foreground">
                  TMDB API data used. Not endorsed or certified by TMDB.
                </p>
              </div>
              <p className="text-[12px] text-muted-foreground">
                Logo by{" "}
                <a
                  href="https://delapouite.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Delapouite
                </a>{" "}
                /{" "}
                <a
                  href="https://creativecommons.org/licenses/by/3.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  CC BY 3.0
                </a>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1 border-t pt-1 border-border/50">
                © {currentYear} Team Delta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
