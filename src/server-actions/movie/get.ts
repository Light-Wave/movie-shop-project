"use server";

import { prisma } from "@/lib/prisma";

export async function getMovie(id: string) {
  return prisma.movie.findUnique({
    where: { id },
    include: {
      genres: true,
      movieArtists: {
        include: {
          artist: true,
        },
      },
    },
  });
}
