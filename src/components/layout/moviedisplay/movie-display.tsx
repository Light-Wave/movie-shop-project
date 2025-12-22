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
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/prise-display";
import { MovieWithDetails } from "@/components/sharedutils/movie-fetch";
import placeholder from "../../../../public/placeholders/placeholder.jpg";
import { useCartPlaceholder } from "../../../../public/placeholders/cart-placeholder";

/**
 * Displays lists of movies under a section title.
 * takes in sectionTitle and movieData
 * isMissingData is a check that there is content to show, set to false as default
 */
export default function MovieDisplay({
  sectionTitle,
  movieData,
  isMissingData = false,
}: {
  sectionTitle?: string;
  movieData: MovieWithDetails[];
  isMissingData?: boolean;
}) {
  const { handleAddToCart } = useCartPlaceholder();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold">{sectionTitle}</h2>
        {isMissingData && (
          <span className="text-xs font-medium bg-amber-100 text-amber-800 px-2 py-1 rounded-full animate-pulse">
            ⚠️ Data missing from DB - Showing placeholders or empty
          </span>
        )}
      </div>

      {movieData.length === 0 && !isMissingData ? (
        <div className="p-12 text-center bg-zinc-100 rounded-xl border-2 border-dashed border-zinc-300">
          <p className="text-zinc-500">No movies found in this category.</p>
        </div>
      ) : (
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full px-4"
        >
          <CarouselContent>
            {movieData.map((movie) => (
              <CarouselItem
                key={movie.id}
                className=" basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <Link
                  href={`/browse/${movie.id}`}
                  className="block h-full transition-transform hover:scale-[1.02]"
                >
                  <Card className="gap-0.5 pb-1 h-full overflow-hidden border-zinc-200 flex flex-col">
                    <div className="relative aspect-2/3 w-full overflow-hidden">
                      <Image
                        src={movie.imageUrl || placeholder}
                        alt={`${movie.title} poster`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    </div>

                    <CardContent className="px-3 pt-1 pb-1.5 flex flex-col grow">
                      <div className="flex flex-col">
                        <CardTitle className="text-lg font-bold line-clamp-1">
                          {movie.title}
                        </CardTitle>
                        <div className="flex items-center font-bold">
                          <PriceDisplay price={movie.price} />
                        </div>
                      </div>

                      <CardDescription className="text-sm line-clamp-2 text-zinc-500 my-2 grow">
                        {movie.description || "No description available."}
                      </CardDescription>

                      <CardFooter className="p-0 mt-auto">
                        <Button
                          className="w-full"
                          variant="default"
                          size="sm"
                          onClick={(e) => handleAddToCart(e, movie.title)}
                        >
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-6 h-12 w-12 border-2" />
            <CarouselNext className="-right-6 h-12 w-12 border-2" />
          </div>
        </Carousel>
      )}
    </div>
  );
}
