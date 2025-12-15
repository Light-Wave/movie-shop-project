import { prisma } from "@/lib/prisma";
import MovieCreateForm from "../../../../components/Forms/movie-form-client";

export default async function NewMoviePage() {
  const artists = await prisma.artist.findMany();
  const genres = await prisma.genre.findMany();

  return <MovieCreateForm artists={artists} genres={genres} />;
}
