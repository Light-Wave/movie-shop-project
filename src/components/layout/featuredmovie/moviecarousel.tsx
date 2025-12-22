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

/**
 * Carousel component for featured movies, takes Moviedata[]
 * currently hardcoded in page.tsx <- this should be changed to varables, (probably set in admin?)
 */
export default function FeaturedCarousel({
  movieData,
}: {
  movieData: MovieWithDetails[];
}) {
  const trailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <div className="mx-auto max-w-6xl shadow-2xl rounded-xl">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {movieData.map((movie, index) => {
            const directorLink = movie.movieLinks.find(
              (link) => link.role === "DIRECTOR"
            );
            const actorLink = movie.movieLinks.find(
              (link) => link.role === "ACTOR"
            );

            return (
              <CarouselItem
                key={index}
                className="flex flex-col h-auto sm:flex-row sm:h-[600px] justify-betwee rounded-xl overflow-hidden"
              >
                {/* Image Section "left" */}
                <div className="w-full h-[400px] sm:w-1/2 sm:h-full relative group">
                  <Image
                    src={movie.imageUrl || placeholder}
                    alt={`${movie.title} poster`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={index === 0}
                  />
                </div>

                {/* Content Section "right" */}
                <div className="w-full sm:w-1/2 flex flex-col justify-center p-6 space-y-6 relative">
                  <div className="space-y-4">
                    <CardTitle className="text-4xl sm:text-6xl font-black tracking-tight">
                      {movie.title}
                    </CardTitle>
                    <CardDescription className="text-lg sm:text-xl text-gray-600 tracking-tight">
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
                        href={trailerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="w-5 h-5 fill-current" />
                        Watch Trailer
                      </a>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-8 font-bold"
                      asChild
                    >
                      <Link href={`/browse/${movie.id}`}>View Details</Link>
                    </Button>
                  </div>

                  {/* people section, right now taking a single Director and a single Actor.
                   * TODO: Decide on how many artists should be displayed.
                   */}
                  <div className="flex flex-wrap gap-2">
                    {directorLink && <ArtistBadge movieLink={directorLink} />}
                    {actorLink && <ArtistBadge movieLink={actorLink} />}
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
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </div>
      </Carousel>
    </div>
  );
}
