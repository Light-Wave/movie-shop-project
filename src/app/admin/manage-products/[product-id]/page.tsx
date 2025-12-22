import { prisma } from "@/lib/prisma";

import { notFound } from "next/navigation";
import MovieEditForm from "@/components/Forms/movie-form-edit-client";

export default async function EditMoviePage(
  props: PageProps<"/admin/manage-products/[product-id]">
) {
  const params = await props.params;
  const moviePromise = prisma.movie.findUnique({
    where: { id: params["product-id"] },
    include: {
      genres: true,
      movieLinks: {
        include: {
          artist: true,
        },
      },
    },
  });
  const genrePromise = prisma.genre.findMany();
  const artistPromise = prisma.artist.findMany();
  const [movie, genres, artists] = await Promise.all([
    moviePromise,
    genrePromise,
    artistPromise,
  ]);

  if (!movie) {
    return notFound();
  }
  return (
    <MovieEditForm
      artists={artists}
      movie={movie}
      genres={genres}
    ></MovieEditForm>
  );
}
