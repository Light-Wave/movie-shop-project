// Browse movies (optional filtering)
// o By genre
// o By director
// o By actor
//  Search functionality for movies (basic search by title)

// Add movies to cart (stored in cookies)

// Optional - Implement more complex filters (e.g., release year range, runtime, multiple genres)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

/*
Optinal:
7. Advanced Search
o Implement full-text search for movies using PostgreSQL's full-text search
capabilities
o Include search by director, actor, and genre*/
import { ArtistBadge } from "@/components/artist-badge";
import { GenreBadge } from "@/components/genre-badge";
import { MovieTable } from "@/components/movie-browser";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { prisma } from "@/lib/prisma";
import { ChevronsUpDown } from "lucide-react";

export default async function Dashboard({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const genresSearch = (await searchParams)?.genre;
  const artistSearch = (await searchParams)?.artist;
  const searchTerm = (await searchParams)?.search;

  const moviePromise = prisma.movie.findMany({
    include: {
      genres: { select: { id: true, name: true } },
      movieLinks: {
        select: {
          role: true,
          artist: true,
        },
      },
    },
    where: {
      ...(genresSearch && {
        genres: {
          some: { name: genresSearch as string },
        },
      }),
      ...(artistSearch && {
        movieLinks: {
          some: {
            artist: {
              name: artistSearch as string,
            },
          },
        },
      }),
      ...(searchTerm && {
        title: {
          contains: searchTerm as string,
          mode: "insensitive",
        },
      }),
      isAvailable: true,
    },
  });
  const genrePromise = prisma.genre.findMany({
    select: { _count: { select: { movies: true } }, id: true, name: true },

    orderBy: { movies: { _count: "desc" } },
  });
  const artistPromise = prisma.artist.findMany({
    select: { _count: { select: { movieLinks: true } }, id: true, name: true },
    orderBy: { movieLinks: { _count: "desc" } },
  });
  const [movies, genres, artists] = await Promise.all([
    moviePromise,
    genrePromise,
    artistPromise,
  ]);
  return (
    <div>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Genres <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {genres.map((genre) => (
              <GenreBadge key={genre.id} genre={genre} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Artists <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {artists.map((artist) => (
              <ArtistBadge key={artist.id} artist={artist} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <React.Suspense fallback={<div />}>
        <MovieTable data={movies} />
      </React.Suspense>
    </div>
  );
}
