//Edit existing movie information

// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)
"use server";

import { prisma } from "@/lib/prisma";
import { updateMovieSchema } from "@/zod/movie";
import { auth } from "@/lib/auth";
import { ArtistRole, Prisma } from "@/generated/prisma/client";
import { z } from "zod";
import { headers } from "next/headers";

const updateSchema = updateMovieSchema;

export async function updateMovie(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "You must be logged in to update a movie." };
  //TODO: Verify user is admin
  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue: z.ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false, errors };
  }

  const { id, genres, artists, ...data } = parsed.data;

  const existing = await prisma.movie.findUnique({
    where: { id: id },
  });

  if (!existing) return { error: "Movie not found." };

  await prisma.movieArtist.deleteMany({ where: { movieId: id } });

  const movie = await prisma.movie.update({
    where: { id: id },
    data: {
      ...data,
      price:
        typeof data.price === "number"
          ? Math.round(data.price * 100)
          : undefined,
      genres: {
        set: genres ? genres.map((genreId: string) => ({ id: genreId })) : [],
      },
      movieArtists: {
        create: artists
          ? artists.map((artist: { artistId: string; role: string }) => ({
              artist: { connect: { id: artist.artistId } },
              role: artist.role as ArtistRole,
            }))
          : [],
      },
    },
  });

  return { success: true, movie };
}
