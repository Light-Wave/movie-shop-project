"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowLeft, Home } from "lucide-react";

interface MovieNotFoundProps {
  searchTerm: string;
}

/**
 * Movie not found page component
 * takes searchterm and disply it for the user to make it visibly clear what was searched for in case of misspellings or similar
 */

export default function MovieNotFound({ searchTerm }: MovieNotFoundProps) {
  const displaySearchTerm = decodeURIComponent(searchTerm).trim();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card className="max-w-2xl w-full border-none shadow-2xl">
        <CardHeader className="text-center pb-2 relative">
          <CardTitle className="text-6xl font-black">404</CardTitle>
          <p className="text-xl font-semibold mt-2">Movie Not Found</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="p-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Search className="w-7 h-7" />
              <p className="text-sm font-medium text-center">
                YOU SEARCHED FOR:
              </p>
            </div>
            <p className="text-2xl font-bold wrap-break-word">
              &ldquo;{displaySearchTerm}&rdquo;
            </p>
          </div>

          <p className="text-center text-muted-foreground leading-relaxed">
            We could not find any movie matching your search in our database.
            <br />
            Please check the spelling of the searchterm above
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              variant="default"
              className="flex-1 py-6 text-lg font-semibold group  duration-300 hover:scale-[1.05] hover:shadow-lg"
            >
              <Link href="/browse">
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Browse Movies
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 py-6 text-lg font-semibold group transition-all duration-300 hover:scale-[1.04] hover:shadow-lg"
            >
              <Link href="/">
                <Home className="w-5 h-5 mr-2 transition-all duration-300 hover:scale-[1.04] hover:shadow-lg" />
                Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
