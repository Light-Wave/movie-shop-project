//Add new movies with details (title, description, price, release date,
//director, actors, etc.)

// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)

"use server";

import { prisma } from "@/lib/prisma";
import { createMovieSchema } from "@/zod/movie";
import { auth } from "@/lib/auth";
import { ArtistRole, Prisma } from "@/generated/prisma/client";
import { headers } from "next/headers";

export async function createMovie(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "You must be logged in to create a movie." };
  const userId = session.user.id;
  //TODO: Verify user is admin

  const rawData = Object.fromEntries(formData.entries());

  const parsed = createMovieSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return { error: errors };
  }

  const { genres, artists, ...data } = parsed.data;

  const movie = await prisma.movie.create({
    data: {
      ...data,
      price: Math.round(data.price * 100),
      createdBy: { connect: { id: userId } },
      genres: {
        connect: genres.map((id: string) => ({ id })),
      },
      movieArtists: {
        create: artists.map((artist: { artistId: string; role: string }) => ({
          artist: { connect: { id: artist.artistId } },
          role: artist.role as ArtistRole,
        })),
      },
    },
  });

  return { success: true, movie };
}
