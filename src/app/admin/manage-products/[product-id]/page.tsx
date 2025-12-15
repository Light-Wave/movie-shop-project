import { prisma } from "@/lib/prisma";
import MovieForm from "@/components/Forms/movie-form";
import { notFound } from "next/navigation";
import MovieEditForm from "@/components/Forms/movie-form-edit-client";

export default async function EditMoviePage({
  params,
}: {
  params: { "product-id": string };
}) {
  const resolvedParams = await params; // Await the params object
  const movie = await prisma.movie.findUnique({
    where: { id: resolvedParams["product-id"] },
    include: {
      genres: true,
      movieArtists: {
        include: {
          artist: true,
        },
      },
    },
  });
  const artists = await prisma.artist.findMany();
  const genres = await prisma.genre.findMany();

  if (!movie) {
    return notFound();
  }
  return (
    <MovieEditForm artists={artists} movie={movie} genres={genres}></MovieEditForm>
  );
}
