"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function deleteArtist(id: string) {
  const session = await auth.api.getSession();
  if (!session) {
    return { error: "You must be logged in to delete an artist." };
  }

  try {
    await prisma.artist.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete artist." };
  }
}