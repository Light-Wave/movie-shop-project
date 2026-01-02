"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PriceDisplay from "@/components/prise-display";
import { MovieWithDetails } from "@/components/sharedutils/movie-fetch";
import placeholder from "../../../../public/placeholders/placeholder.jpg";
import AddToCartButton from "@/components/cartComponents/addToCartButton";

/**
 * Displays lists of movies under a section title.
 * takes in sectionTitle and movieData
 */
export default function MovieDisplay({
  sectionTitle,
  movieData,
}: {
  sectionTitle?: string;
  movieData: MovieWithDetails[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">{sectionTitle}</h2>
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 sm:-ml-4">
          {movieData.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="pl-2 sm:pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Card className="p-0 h-full overflow-hidden border-zinc-200 flex flex-col hover:border-zinc-300 transition-colors shadow-sm">
                <Link
                  href={`/browse/${movie.id}`}
                  className="transition-transform hover:scale-[1.01] flex-1 flex flex-col"
                >
                  <div className="relative aspect-2/3 w-full overflow-hidden">
                    <Image
                      src={movie.imageUrl || placeholder}
                      alt={`${movie.title} poster`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />

                  </div>

                  <div className="px-3 pt-2 flex flex-col flex-1">
                    <div className="min-h-[2.8rem] sm:min-h-[3.2rem] mb-1">
                      <h3 className="text-base sm:text-xl font-serif font-black line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                        {movie.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-500/90 line-clamp-2 sm:line-clamp-4 leading-relaxed">
                      {movie.description || "No description available."}
                    </p>
                  </div>
                </Link>

                <CardFooter className="w-full px-3 pb-3 pt-1 flex justify-between items-center mt-auto">
                  <div className="flex items-center font-bold text-base sm:text-lg text-green-700/90 italic">
                    <PriceDisplay price={movie.price} />
                  </div>
                  <AddToCartButton
                    movieId={movie.id}
                    className="h-9 px-5 rounded-sm hover:bg-green-700 bg-green-600 text-white font-bold transition-all border-none text-xs shadow-md active:scale-95"
                    size="sm"
                  />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-6 h-12 w-12 border-2" />
          <CarouselNext className="-right-6 h-12 w-12 border-2" />
        </div>
      </Carousel>
    </div>
  );
}
