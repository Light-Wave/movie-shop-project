"use client";

import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MovieWithDetails } from "@/components/sharedutils/movie-fetch";
import placeholder from "../../../../public/placeholders/placeholder.jpg";
import { Play } from "lucide-react";
import { ArtistBadge } from "@/components/artist-badge";
import Link from "next/link";
import AddToCartButton from "@/components/cartComponents/addToCartButton";
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Carousel component for featured movies, takes Moviedata[]
 * currently hardcoded in page.tsx <- this should be changed to varables, (probably set in admin?)
 */
export default function FeaturedCarousel({
  movieData,
}: {
  movieData: MovieWithDetails[];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-full lg:max-w-full sm:mx-auto shadow-none sm:shadow-2xl rounded-none sm:rounded-xl relative group">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {movieData.map((movie, index) => {
            return (
              <CarouselItem
                key={index}
                className="flex flex-col h-auto sm:flex-row sm:min-h-[600px] justify-between rounded-none sm:rounded-xl overflow-hidden"
              >
                {/* Image Section "left" */}
                <div className="w-full h-[500px] sm:w-[400px] lg:w-[500px] sm:h-auto sm:self-stretch relative group shrink-0 overflow-hidden">
                  <Image
                    src={movie.imageUrl || placeholder}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />

                </div>

                {/* Content Section "right" */}
                <div className="w-full h-full flex flex-col p-3 sm:p-10 relative overflow-hidden text-center sm:text-left items-center sm:items-start min-h-[400px]">
                  <div className="flex-1 flex flex-col justify-center w-full space-y-4 sm:space-y-6">
                    <div className="space-y-2 sm:space-y-4 w-full">
                      <CardTitle className="text-2xl sm:text-5xl font-serif font-black tracking-tight line-clamp-none pb-1 sm:pb-2">
                        {movie.title}
                      </CardTitle>
                      {/* mobile artist badges */}
                      <div className="flex flex-wrap gap-2 h-[26px] overflow-hidden sm:hidden justify-center">
                        {movie.movieLinks
                          .sort((a, b) => {
                            if (a.role === "DIRECTOR" && b.role !== "DIRECTOR")
                              return -1;
                            if (a.role !== "DIRECTOR" && b.role === "DIRECTOR")
                              return 1;
                            return 0;
                          })
                          .map((link, i) => (
                            <ArtistBadge key={i} movieLink={link} />
                          ))}
                      </div>
                      <CardDescription className="text-base sm:text-xl text-gray-600 tracking-tight line-clamp-3 sm:line-clamp-4 leading-snug">
                        {movie.description || "No description available."}
                      </CardDescription>
                    </div>

                    <div className="flex flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start">
                      <Button
                        variant="outline"
                        size="default"
                        className="flex-1 sm:flex-initial sm:h-10 sm:px-7 rounded-full px-3.5 font-bold gap-2 sm:bg-zinc-900 sm:text-white sm:border-none sm:hover:bg-zinc-800 transition-all sm:text-base"
                        asChild
                      >
                        <a
                          href={
                            movie.trailerUrl?.replace("/embed/", "/watch?v=") ??
                            undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                          <span>
                            <span className="hidden sm:inline">Watch </span>
                            Trailer
                          </span>
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        className="flex-1 sm:flex-initial sm:h-10 sm:px-7 rounded-full px-3.5 font-bold sm:bg-zinc-900 sm:text-white sm:border-none sm:hover:bg-zinc-800 transition-all sm:text-base"
                        asChild
                      >
                        <Link href={`/browse/${movie.id}`}>
                          <span className="hidden sm:inline">View </span>Details
                        </Link>
                      </Button>
                    </div>

                    {/* Desktop artist badges, placed under description */}
                    <div className="hidden sm:flex flex-wrap gap-2 mt-4">
                      {movie.movieLinks
                        .sort((a, b) => {
                          if (a.role === "DIRECTOR" && b.role !== "DIRECTOR")
                            return -1;
                          if (a.role !== "DIRECTOR" && b.role === "DIRECTOR")
                            return 1;
                          return 0;
                        })
                        .map((link, i) => (
                          <ArtistBadge key={i} movieLink={link} />
                        ))}
                    </div>
                  </div>

                  {/* Bottom Action Bar - Price and Cart */}
                  <div className="w-full flex justify-end mt-4">
                    <AddToCartButton
                      movieId={movie.id}
                      className="w-auto h-10 px-6 sm:h-12 sm:px-8 rounded-full font-serif font-black bg-green-600 hover:bg-green-700 text-white border-none shadow-2xl transition-all active:scale-95 text-base sm:text-lg"
                      size="default"
                    />
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* Pagination, dots with a wider "dot" to show current*/}
        <div className="absolute top-[480px] sm:top-auto sm:bottom-6 left-1/2 sm:left-[200px] -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 shadow-sm",
                current === i ? "bg-white w-6" : "bg-white/40 hover:bg-white/70"
              )}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="hidden md:block">
          <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-zinc-900 border-none shadow-xl" />
          <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-zinc-900 border-none shadow-xl" />
        </div>
      </Carousel>
    </div>
  );
}
