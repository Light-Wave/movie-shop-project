"use server";

import { prisma } from "@/lib/prisma";
import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";
import { normalizeForSearch } from "@/components/sharedutils/slug-utils";

// Define the return type for movie queries with relations
export type MovieWithDetails = Movie & {
  genres: Genre[];
  movieLinks: (MovieArtist & {
    artist: Artist;
  })[];
};

// Standard include object for movie queries to ensure consistency
const movieInclude = {
  genres: true,
  movieLinks: {
    include: {
      artist: true,
    },
  },
} as const;

/**
 * Fetch a movie by its unique ID
 * @param id - The movie's UUID
 * @returns The movie with genres and artist links, or null if not found
 */
export async function getMovieById(id: string): Promise<MovieWithDetails | null> {
  return prisma.movie.findUnique({
    where: { id },
    include: movieInclude,
  });
}

/**
 * Search for a movie by its title using case-insensitive search
 * Uses Prisma's native case-insensitive mode for better performance
 * 
 * @param searchTitle - The title to search for (URL encoded is OK)
 * @returns The first matching movie, or null if not found
 */
export async function getMovieByTitle(searchTitle: string): Promise<MovieWithDetails | null> {
  // Decode URL encoding (e.g., %20 -> space)
  const decodedTitle = decodeURIComponent(searchTitle);

  // Clean up the search term
  const cleanedTitle = normalizeForSearch(decodedTitle);

  // Use Prisma's case-insensitive search with contains for partial matching
  const movie = await prisma.movie.findFirst({
    where: {
      title: {
        equals: cleanedTitle,
        mode: 'insensitive',
      },
    },
    include: movieInclude,
  });

  // If exact match not found, try a contains search
  if (!movie) {
    return prisma.movie.findFirst({
      where: {
        title: {
          contains: cleanedTitle,
          mode: 'insensitive',
        },
      },
      include: movieInclude,
    });
  }

  return movie;
}

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * @param array - The array to shuffle
 * @returns A new shuffled array (does not mutate original)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get movies that share at least one genre with the specified movie
 * Results are shuffled randomly and limited to the specified count
 * 
 * @param currentMovieId - The ID of the current movie to exclude from results
 * @param genreIds - Array of genre IDs to match against
 * @param limit - Maximum number of movies to return (default: 8)
 * @returns Array of similar movies, shuffled randomly
 */
export async function getSimilarMoviesByGenres(
  currentMovieId: string,
  genreIds: string[],
  limit: number = 8
): Promise<MovieWithDetails[]> {
  if (genreIds.length === 0) {
    return [];
  }

  // Find movies that share at least one genre with the current movie
  const similarMovies = await prisma.movie.findMany({
    where: {
      id: { not: currentMovieId }, // Exclude the current movie
      isAvailable: true,
      deletedAt: null,
      genres: {
        some: {
          id: { in: genreIds },
        },
      },
    },
    include: movieInclude,
  });

  // Shuffle the results randomly and limit to the requested count
  const shuffled = shuffleArray(similarMovies);
  return shuffled.slice(0, limit);
}
