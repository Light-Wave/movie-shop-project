import { CardDescription, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MovieWithDetails } from "@/components/sharedutils/movie-fetch";
import placeholder from "../../../../public/placeholders/placeholder.jpg";
import { Play } from "lucide-react";
import { ArtistBadge } from "@/components/artist-badge";
import Link from "next/link";
import AddToCartButton from "@/components/cartComponents/addToCartButton";

/**
 * Carousel component for featured movies, takes Moviedata[]
 * currently hardcoded in page.tsx <- this should be changed to varables, (probably set in admin?)
 */
export default function FeaturedCarousel({
  movieData,
}: {
  movieData: MovieWithDetails[];
}) {
  return (
    <div className="mx-auto max-w-6xl shadow-2xl rounded-xl">
      <Carousel
        className="w-full group"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {movieData.map((movie, index) => {
            return (
              <CarouselItem
                key={index}
                className="flex flex-col h-auto sm:flex-row sm:h-[600px] justify-between rounded-xl overflow-hidden"
              >
                {/* Image Section "left" */}
                <div className="w-full h-[500px] sm:w-[400px] sm:h-full relative group shrink-0">
                  <Image
                    src={movie.imageUrl || placeholder}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>

                {/* Content Section "right" */}
                <div className="w-full h-full flex flex-col justify-center p-6 sm:p-10 space-y-6 relative overflow-hidden">
                  <div className="space-y-4">
                    <CardTitle className="text-4xl sm:text-6xl font-black tracking-tight line-clamp-2 pb-2">
                      {movie.title}
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-xl text-gray-600 tracking-tight line-clamp-3 sm:line-clamp-4">
                      {movie.description || "No description available."}
                    </CardDescription>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      size="lg"
                      className="rounded-full px-8 font-bold gap-2"
                      asChild
                    >
                      <a
                        href={movie.trailerUrl ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Watch Trailer
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full px-8 font-bold"
                      asChild
                    >
                      <Link href={`/browse/${movie.id}`}>View Details</Link>
                    </Button>
                    <AddToCartButton
                      movieId={movie.id}
                      className="rounded-full px-8 font-bold"
                      size="lg"
                    />
                  </div>

                  {/* people section, displaying multiple artists in a single row without partial cuts */}
                  <div className="flex flex-wrap gap-2 h-[26px] overflow-hidden">
                    {movie.movieLinks
                      .sort((a, b) => {
                        // Show DIRECTORS first
                        if (a.role === "DIRECTOR" && b.role !== "DIRECTOR") return -1;
                        if (a.role !== "DIRECTOR" && b.role === "DIRECTOR") return 1;
                        return 0;
                      })
                      .map((link, i) => (
                        <ArtistBadge key={i} movieLink={link} />
                      ))}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/*navigation arrows for above mobile.
         * Unsure if we want to keep them even on large devices
         * Pro: Easier to see that more movies are featured
         * Con: not very elegant
         * TODO: Decide if the arrows are necessary
         */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-zinc-900 border-none shadow-xl" />
          <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white text-zinc-900 border-none shadow-xl" />
        </div>
      </Carousel>
    </div>
  );
}
