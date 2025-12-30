// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)

"use server";

import { prisma } from "@/lib/prisma";
import { updateGenreSchema } from "@/zod/genres";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateGenre(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  // Add admin role check
  if (!session) {
    return { error: "Unauthorized: Must be logged in to update a genre." };
  }
  const user = (session as unknown as { user?: { role?: string } })?.user;
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized: Must be an admin to update genres." };
  }
  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateGenreSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false, errors };
  }

  const data = parsed.data;

  const existing = await prisma.genre.findUnique({
    where: { id: data.id },
  });

  if (!existing) return { error: "Genre not found." };

  const genre = await prisma.genre.update({
    where: { id: data.id },
    data,
  });

  return { success: true, genre };
}
