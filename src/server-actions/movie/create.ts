//Add new movies with details (title, description, price, release date,
//director, actors, etc.)

// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)

"use server";

import { prisma } from "@/lib/prisma";
import { createMovieSchema } from "@/zod/movie";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

export async function createMovie(formData: FormData) {
  const session = await auth.api.getSession();
  if (!session) return { error: "You must be logged in to create a movie." };
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

  const data = parsed.data;

  const movie = await prisma.movie.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
      createdBy: { connect: { id: userId } },
    },
  });

  return { success: true, movie };
}
