"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/prise-display";
import { generateMovieUrl } from "@/components/sharedutils/slug-utils";
import placeholder from "../../../../public/placeholders/placeholder.jpg";

import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";
import AddToCartButton from "@/components/cartComponents/addToCartButton";

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

  return (
    <Card className="p-0 h-full overflow-hidden border-zinc-200 transition-all duration-300 hover:shadow-md grid grid-rows-[auto_1fr] w-full sm:w-auto">
      <Link href={movieUrl} className="group block">
        <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
          <Image
            src={movie.imageUrl || placeholder}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 15vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

        </div>

        <CardContent className="p-2 flex flex-col justify-between gap-2">
          <div className="space-y-1.5">
            <CardTitle className="text-sm font-bold line-clamp-2 leading-snug min-h-[2.8em]">
              {movie.title}
            </CardTitle>

            <div className="flex flex-wrap gap-1">
              {movie.genres?.slice(0, 2).map((genre) => (
                <Badge
                  key={genre.id}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 uppercase tracking-wider font-semibold"
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-2 pt-0 flex justify-between items-center gap-2">
        <div className="text-sm font-black text-green-700/90 italic">
          <PriceDisplay price={movie.price} />
        </div>
        <AddToCartButton
          movieId={movie.id}
          className="text-[10px] h-8 px-3 font-bold transition-all bg-green-600 hover:bg-green-700 text-white border-none shadow-sm"
          size="sm"
        />
      </CardFooter>
    </Card>
  );
}
