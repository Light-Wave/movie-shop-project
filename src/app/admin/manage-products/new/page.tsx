import { prisma } from "@/lib/prisma";
import MovieCreateForm from "../../../../components/Forms/movie-form-client";

export default async function NewMoviePage() {
  const artistsPromise = prisma.artist.findMany();
  const genresPromise = prisma.genre.findMany();
  const [artists, genres] = await Promise.all([artistsPromise, genresPromise]);

  return <MovieCreateForm artists={artists} genres={genres} />;
}
