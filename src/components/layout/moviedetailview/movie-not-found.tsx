"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft, Home } from "lucide-react";

interface MovieNotFoundProps {
  searchTerm: string;
}

export default function MovieNotFound({ searchTerm }: MovieNotFoundProps) {
  // clean up the search term for display
  const displaySearchTerm = decodeURIComponent(searchTerm).trim();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full border-none shadow-2xl bg-linear-to-br from-card via-card to-muted/30 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-destructive/5 rounded-full blur-3xl" />
        </div>

        <CardHeader className="text-center pb-2 relative">
          <CardTitle className="text-7xl font-black tracking-tighter bg-linear-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
            404
          </CardTitle>
          <p className="text-xl font-semibold text-muted-foreground mt-2">
            Movie Not Found
          </p>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Display the search term */}
          <div className="bg-muted/50 rounded-xl p-6 border border-border/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-muted-foreground mb-3">
              <Search className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wide">
                You searched for
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground wrap-break-word">
              &ldquo;{displaySearchTerm}&rdquo;
            </p>
          </div>

          <p className="text-center text-muted-foreground leading-relaxed">
            We could not find any movie matching your search in our database.
            The title might be misspelled, or this movie may not be in our
            collection yet.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              variant="default"
              className="flex-1 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href="/browse">
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Browse Movies
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
