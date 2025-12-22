import { prisma } from "@/lib/prisma";
import { GenreUpdateForm } from "../../../../components/Forms/genre-form";
import { notFound } from "next/navigation";

export default async function EditGenrePage(
  props: PageProps<"/admin/manage-genre/[genre-id]">
) {
  const params = await props.params;
  const genre = await prisma.genre.findUnique({
    where: { id: params["genre-id"] },
  });
  if (!genre) {
    notFound();
  }
  return <GenreUpdateForm genre={genre} />;
}
