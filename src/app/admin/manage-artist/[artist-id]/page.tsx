import { prisma } from "@/lib/prisma";
import { UpdateArtistForm } from "../../../../components/Forms/artist-form";
import { notFound } from "next/navigation";

export default async function EditArtistPage(
  props: PageProps<"/admin/manage-artist/[artist-id]">
) {
  const params = await props.params;
  const artist = await prisma.artist.findUnique({
    where: { id: params["artist-id"] },
  });
  if (!artist) {
    notFound();
  }
  return <UpdateArtistForm artist={artist} />;
}
