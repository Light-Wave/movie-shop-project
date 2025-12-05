import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Children, ReactNode } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Genre, Movie } from "@/generated/prisma/client";
import PriceDisplay from "./prise-display";
import { prisma } from "@/lib/prisma";
import { Badge } from "./ui/badge";
import { MovieWithGenres } from "./types/movie";

type Params = { movie: MovieWithGenres; children: ReactNode };

export function HoverCardMovie({ movie, children }: Params) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          {movie.imageUrl !== null && (
            <Avatar>
              <AvatarImage src={movie.imageUrl} />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
          )}

          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{movie.title}</h4>
            <p className="text-sm">{movie.description}</p>
            <div className="space-x-1">
              {movie.genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>
            <div className="text-muted-foreground text-xs">
              <PriceDisplay movie={movie} />
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
