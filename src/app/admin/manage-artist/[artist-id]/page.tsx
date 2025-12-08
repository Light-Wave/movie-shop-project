import { prisma } from "@/lib/prisma";
import { UpdateArtistForm } from "../page";
import { notFound } from "next/navigation";

export default async function EditArtistPage({
  params,
}: {
  params: { "artist-id": string };
}) {
  const artist = await prisma.artist.findUnique({
    where: { id: params["artist-id"] },
  });
  if (!artist) {
    notFound();
  }
  return <UpdateArtistForm artist={artist} />;
}
