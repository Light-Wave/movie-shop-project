"use server";

import { prisma } from "@/lib/prisma";

export async function getArtists() {
  return prisma.artist.findMany();
}
