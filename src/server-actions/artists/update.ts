// Use Zod for server-side data validation within server actions
// Utilize Better Auth for user-related actions (registration, login, profile updates)

"use server";

import { prisma } from "@/lib/prisma";
import { updateArtistSchema } from "@/zod/artists";
import { auth } from "@/lib/auth";

export async function updateArtist(formData: FormData) {
  const session = await auth.api.getSession();
  if (!session) return { error: "You must be logged in to update an artist." };

  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateArtistSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { success: false, errors };
  }

  const data = parsed.data;

  const existing = await prisma.artist.findUnique({
    where: { id: data.id },
  });

  if (!existing) return { error: "Artist not found." };

  const artist = await prisma.artist.update({
    where: { id: data.id },
    data,
  });

  return { success: true, artist };
}
