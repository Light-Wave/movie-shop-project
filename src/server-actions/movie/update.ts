//Edit existing movie information

// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)
"use server";

import { prisma } from "@/lib/prisma";
import { updateMovieSchema } from "@/zod/movie";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";
import { z } from "zod";

const updateSchema = updateMovieSchema;

export async function updateMovie(formData: FormData) {
  const session = await auth.api.getSession();
  if (!session) return { error: "You must be logged in to update a movie." };

  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue: z.ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false, errors };
  }

  const data = parsed.data;

  const existing = await prisma.movie.findUnique({
    where: { id: data.id },
  });

  if (!existing) return { error: "Movie not found." };

  const movie = await prisma.movie.update({
    where: { id: data.id },
    data: {
      ...data,
      price:
        typeof data.price === "number"
          ? new Prisma.Decimal(data.price)
          : undefined,
    },
  });

  return { success: true, movie };
}
