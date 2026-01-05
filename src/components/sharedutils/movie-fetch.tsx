"use server";
/**
 * TODO many of the fetch functions are similar, can they be condensed?
 */
import { prisma } from "@/lib/prisma";
import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";
import {
  normalizeForSearch,
  isUUID,
} from "@/components/sharedutils/slug-utils";

/**
 * Find a movie by either its unique ID or its title
 * takes in a mixed string from URL
 * first part is UUID
 * Second is title
 * separated by "-"
 * both/or uuid and/or title acceptable as long as it is separated by "-"
 */
export async function getMovieByFlexibleParam(
  param: string
): Promise<MovieWithDetails | null> {
  const parts = param.split("-");
  const potentialUUID = parts.slice(0, 5).join("-");

  if (isUUID(potentialUUID)) {
    return getMovieById(potentialUUID);
  }

  return getMovieByTitle(param);
}

export type MovieWithDetails = Movie & {
  genres: Genre[];
  movieLinks: (MovieArtist & {
    artist: Artist;
  })[];
};

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
 * looks up a exact UUID in database
 * NOTE: Not entirely sure this is needed, depending on how we want the slug to look
 */
export async function getMovieById(
  id: string
): Promise<MovieWithDetails | null> {
  return prisma.movie.findUnique({
    where: { id },
    include: movieInclude,
  });
}

/**
 * Search for a movie by its title using case-insensitive search
 * will attempt a "contains" search if no exact match found
 * should pick up partial movie titles
 * NOTE: Will pick up first title only
 * returns null if not found
 */
export async function getMovieByTitle(
  searchTitle: string
): Promise<MovieWithDetails | null> {
  const decodedTitle = decodeURIComponent(searchTitle);
  const cleanedTitle = normalizeForSearch(decodedTitle);
  const movie = await prisma.movie.findFirst({
    where: {
      title: {
        equals: cleanedTitle,
        mode: "insensitive",
      },
    },
    include: movieInclude,
  });

  if (!movie) {
    return prisma.movie.findFirst({
      where: {
        title: {
          contains: cleanedTitle,
          mode: "insensitive",
        },
      },
      include: movieInclude,
    });
  }

  return movie;
}

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 * NOTE: algorithm borrowed from stackoverflow, seems to be working but not fully understood
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
 * Takes currentmovieID to match against, returns the "limit" param of genres
 */
export async function getSimilarMoviesByGenres(
  currentMovieId: string,
  genreIds: string[],
  limit: number = 8
): Promise<MovieWithDetails[]> {
  if (genreIds.length === 0) {
    return [];
  }

  /* Find movies that share at least one genre with the current movie
   * Excludes the movie currently displayed in detailed-movie-view
   */
  const similarMovies = await prisma.movie.findMany({
    where: {
      id: { not: currentMovieId },
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
/**
 * Get the top X most purchased movies
 * Currently works based on orderItem count
 * No order seed currently so to make it work properly, you have to manually set up a few orders in the shop
 * if less then ten movies with order above 0 is found, it just fills the list out with the first movies it finds.
 */
export async function getTopPurchasedMovies(
  limit: number = 5
): Promise<MovieWithDetails[]> {
  const movies = await prisma.movie.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
    },
    include: movieInclude,
    orderBy: {
      orderItems: {
        _count: "desc",
      },
    },
    take: limit,
  });

  return movies;
}

/**
 * Get the top X most recently added movies
 */
export async function getRecentlyAddedMovies(
  limit: number = 5
): Promise<MovieWithDetails[]> {
  return prisma.movie.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
    },
    include: movieInclude,
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

/**
 * Get the top X oldest movies (by release date)
 */
export async function getOldestMovies(
  limit: number = 5
): Promise<MovieWithDetails[]> {
  return prisma.movie.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
      releaseDate: { not: null },
    },
    include: movieInclude,
    orderBy: {
      releaseDate: "asc",
    },
    take: limit,
  });
}

/**
 * Get the top X cheapest movies
 */
export async function getCheapestMovies(
  limit: number = 5
): Promise<MovieWithDetails[]> {
  return prisma.movie.findMany({
    where: {
      isAvailable: true,
      deletedAt: null,
    },
    include: movieInclude,
    orderBy: {
      price: "asc",
    },
    take: limit,
  });
}
