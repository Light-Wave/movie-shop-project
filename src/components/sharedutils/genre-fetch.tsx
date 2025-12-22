import { prisma } from "@/lib/prisma";
import { ReducedGenre } from "@/components/types/movie";

/**
 * Fetches the top genres based on the number of movies in each genre.
 * takes in a optional param "limit" that decides how many to fetch
 * default 18
 */

export async function getTopGenres(
  limit: number = 18
): Promise<(ReducedGenre & { _count: { movies: number } })[]> {
  try {
    const genres = await prisma.genre.findMany({
      take: limit,
      include: {
        _count: {
          select: { movies: true },
        },
      },
      orderBy: {
        movies: {
          _count: "desc",
        },
      },
    });
    return genres;
  } catch (error) {
    console.error("Failed to fetch genres:", error);
    return [];
  }
}
