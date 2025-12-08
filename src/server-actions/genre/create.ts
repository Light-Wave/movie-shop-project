// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)

"use server";

import { prisma } from "@/lib/prisma";
import { createGenreSchema } from "@/zod/genres";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function createGenre(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "You must be logged in to create a genre." };

  const userId = session.user.id;
  //TODO: Verify user is admin
  const rawData = Object.fromEntries(formData.entries());
  const parsed = createGenreSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { error: errors };
  }

  const data = parsed.data;

  const genre = await prisma.genre.create({
    data: {
      ...data,
      createdById: userId,
    },
  });

  return { success: true, genre };
}
