import { prisma } from "@/lib/prisma";
import { GenreUpdateForm } from "../../../../components/Forms/genre-form";
import { notFound } from "next/navigation";

type Props = {
  params: { "genre-id": string };
};

export default async function EditGenrePage({ params }: Props) {
  const genre = await prisma.genre.findUnique({
    where: { id: params["genre-id"] },
  });
  if (!genre) {
    notFound();
  }
  return <GenreUpdateForm genre={genre} />;
}
