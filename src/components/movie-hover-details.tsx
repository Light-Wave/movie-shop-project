import { ReactNode } from "react";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Genre, Movie } from "@/generated/prisma/client";
import PriceDisplay from "./prise-display";
import { prisma } from "@/lib/prisma";
import { Badge } from "./ui/badge";
import { MovieWithDetails } from "./types/movie";
import { GenreBadge } from "./genre-badge";
import { ArtistBadge } from "./artist-badge";
import placeholder from "../../public/placeholders/placeholder.jpg";

type Params = { movie: MovieWithDetails; children: ReactNode };

export function HoverCardMovie({ movie, children }: Params) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        className="w-80 p-0 overflow-hidden border-zinc-200 shadow-xl"
        collisionPadding={16}
      >
        <div className="flex flex-col">
          <div className="relative w-full aspect-2/3 bg-muted">
            <Image
              src={movie.imageUrl || placeholder}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="320px"
              priority
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h4 className="text-lg font-bold leading-tight">{movie.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {movie.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1">
              {movie.genres.slice(0, 3).map((genre) => (
                <GenreBadge key={genre.id} genre={genre} />
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {movie.movieLinks.slice(0, 3).map((movieLink) => (
                <ArtistBadge key={movieLink.artist.id} movieLink={movieLink} />
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between border-t mt-2">
              <div className="text-lg font-bold text-green-700">
                <PriceDisplay price={movie.price} />
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
