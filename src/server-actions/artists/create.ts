"use server";

import { prisma } from "@/lib/prisma";
import { createArtistSchema } from "@/zod/artists";
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; // Import headers

export async function createArtist(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "You must be logged in to create an artist." };
  const userId = session.user.id;

  const rawData = Object.fromEntries(formData.entries());
  const parsed = createArtistSchema.safeParse(rawData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { error: errors };
  }

  const data = parsed.data;

  const artist = await prisma.artist.create({
    data: {
      ...data,
      createdById: userId,
    },
  });

  return { success: true, artist };
}
