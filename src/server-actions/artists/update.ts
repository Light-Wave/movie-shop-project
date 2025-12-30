"use server";

import { prisma } from "@/lib/prisma";
import { updateArtistSchema } from "@/zod/artists";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function updateArtist(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  // Add admin role check
  if (!session) {
    return { error: "Unauthorized: Must be logged in to update an artist." };
  }
  const user = (session as unknown as { user?: { role?: string } })?.user;
  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized: Must be an admin to update artists." };
  }
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
