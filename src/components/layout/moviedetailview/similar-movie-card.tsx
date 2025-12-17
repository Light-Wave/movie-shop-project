"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PriceDisplay from "@/components/prise-display";
import { generateMovieUrl } from "@/components/sharedutils/slug-utils";
import placeholder from "../placeholders/placeholder.jpg";

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

export function SimilarMovieCard({ movie }: SimilarMovieCardProps) {
  const movieUrl = generateMovieUrl(movie.id, movie.title);

  return (
    <Link
      href={movieUrl}
      className="group shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(25%-0.75rem)] lg:w-[calc(16.666%-0.85rem)]"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-none bg-linear-to-b from-card to-muted/30">
        <div className="relative aspect-2/3 overflow-hidden">
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
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <CardContent className="p-3">
          <CardTitle className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {movie.title}
          </CardTitle>
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres?.slice(0, 2).map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="text-xs px-1.5 py-0.5"
              >
                {genre.name}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-sm font-bold text-primary">
            <PriceDisplay price={movie.price} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
