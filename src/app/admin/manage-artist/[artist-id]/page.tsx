import { prisma } from "@/lib/prisma";
import { UpdateArtistForm } from "../page";

export default async function EditArtistPage({
  params,
}: {
  params: { "artist-id": string };
}) {
  const artist = await prisma.artist.findUnique({
    where: { id: params["artist-id"] },
  });

  if (!artist) {
    return <div>Artist not found</div>;
  }

  return <UpdateArtistForm artist={artist} />;
}
