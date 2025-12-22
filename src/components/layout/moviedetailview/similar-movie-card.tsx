"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/prise-display";
import { generateMovieUrl } from "@/components/sharedutils/slug-utils";
import { Button } from "@/components/ui/button";
import { useCartPlaceholder } from "../../../../public/placeholders/cart-placeholder";
import placeholder from "../../../../public/placeholders/placeholder.jpg";

import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";

export type SimilarMovie = Movie & {
  genres: Genre[];
  movieLinks: (MovieArtist & {
    artist: Artist;
  })[];
};

interface SimilarMovieCardProps {
  movie: SimilarMovie;
}
/**
 * takes in a movie and display recommended movies based on the genre of the movie
 * TODO: Possibly improve this to take other factors into account.
 * not using Genrebadge since css collided and it didn not make much sense to have the badges clickable here
 */
export function SimilarMovieCard({ movie }: SimilarMovieCardProps) {
  const movieUrl = generateMovieUrl(movie.id, movie.title);
  const { handleAddToCart } = useCartPlaceholder();

  return (
    <Link
      href={movieUrl}
      className=" w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.85rem)]"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:scale-105">
        <div className="aspect-2/3 overflow-hidden">
          {movie.imageUrl ? (
            <Image
              src={movie.imageUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="relative w-full h-full bg-muted flex items-center justify-center">
              <Image
                src={placeholder}
                alt={movie.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 17vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
        <CardContent className="px-2 flex flex-col">
          <CardTitle className="text-sm font-semibold line-clamp-2">
            {movie.title}
          </CardTitle>
          <div className="flex flex-wrap mt-1">
            {movie.genres?.slice(0, 2).map((genre) => (
              <Badge key={genre.id} variant="secondary" className="text-xs">
                {genre.name}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-sm font-bold">
            <PriceDisplay price={movie.price} />
          </div>
          <div className="mt-2">
            <Button
              variant="default"
              size="sm"
              className="w-full text-xs h-8"
              onClick={(e) => handleAddToCart(e, movie.title)}
            >
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
