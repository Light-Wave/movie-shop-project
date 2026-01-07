"use server";
import { prisma } from "@/lib/prisma";

export async function getMovieSuggestions(query: string) {
  if (!query) {
    return [];
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        isAvailable: true,
      },
      take: 5,
      select: {
        id: true,
        title: true,
      },
    });
    return movies;
  } catch (error) {
    console.error("Failed to fetch movie suggestions:", error);
    return [];
  }
}
