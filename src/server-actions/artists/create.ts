"use server";

import { prisma } from "@/lib/prisma";
import { createArtistSchema } from "@/zod/artists";
import { auth } from "@/lib/auth";
import { headers } from "next/headers"; // Import headers

export async function createArtist(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  // Add admin role check
  if (!session) {
    return { error: "Unauthorized: Must be logged in to create an artist." };
  }
  const user = (session as unknown as { user?: { role?: string } })?.user;
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized: Must be an admin to create artists." };
  }

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
