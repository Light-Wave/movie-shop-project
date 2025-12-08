"use server";

import { prisma } from "@/lib/prisma";
import { updateArtistSchema } from "@/zod/artists";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateArtist(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "You must be logged in to update an artist." };
  //TODO: Verify user is admin
  const rawData = Object.fromEntries(formData.entries());
  const parsed = updateArtistSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { error: errors };
  }

  const { id, ...data } = parsed.data;

  const artist = await prisma.artist.update({
    where: { id },
    data,
  });

  return { success: true, artist };
}
