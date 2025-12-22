"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { GenreBadge } from "@/components/genre-badge";
import { ReducedGenre } from "@/components/types/movie";

interface GenreCarouselProps {
  genres: (ReducedGenre & { _count?: { movies: number } })[];
}
/**
 * Displays a carousel of genres for mobile devices and a grid of genres for desktop devices.
 * Solution for genres looking rather bad on mobile devices
 * Carousel Only visible below screen size of md (<768px) otherwise simply the normal genre display
 */
export function GenreCarousel({ genres }: GenreCarouselProps) {
  return (
    <>
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full md:hidden"
      >
        <CarouselContent className="-ml-2">
          {genres.map((genre) => (
            <CarouselItem key={genre.id} className="pl-2 basis-auto">
              <GenreBadge genre={genre} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="hidden md:flex flex-wrap gap-2">
        {genres.map((genre) => (
          <GenreBadge key={genre.id} genre={genre} />
        ))}
      </div>
    </>
  );
}
