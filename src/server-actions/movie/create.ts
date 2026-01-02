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
  // Add admin role check
  if (!session) {
    return { error: "Unauthorized: Must be logged in to create a movie." };
  }
  const user = (session as unknown as { user?: { role?: string } })?.user;
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized: Must be an admin to create movies." };
  }
  const userId = session.user.id;

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
      movieLinks: {
        create: artists.map((artist: { artistId: string; role: string }) => ({
          artist: { connect: { id: artist.artistId } },
          role: artist.role as ArtistRole,
        })),
      },
    },
  });

  return { success: true, movie };
}
