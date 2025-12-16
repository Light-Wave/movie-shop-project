import { prisma } from "@/lib/prisma";
import MovieForm from "@/components/Forms/movie-form";
import { notFound } from "next/navigation";
import MovieEditForm from "@/components/Forms/movie-form-edit-client";

async function getMovie(id: string) {
    return prisma.movie.findUnique({
      where: { id },
      include: {
        genres: true,
        movieArtists: {
          include: {
            artist: true,
          },
        },
      },
    });
}

async function getArtists() {
    return prisma.artist.findMany();
}

async function getGenres() {
    return prisma.genre.findMany();
}

export default async function EditMoviePage({
  params,
}: {
  params: { "product-id": string };
}) {
  const resolvedParams = await params; // Await the params object
  const movie = await getMovie(resolvedParams["product-id"]);
  const artists = await getArtists();
  const genres = await getGenres();

  if (!movie) {
    return notFound();
  }
  return (
    <MovieEditForm artists={artists} movie={movie} genres={genres}></MovieEditForm>
  );
}
