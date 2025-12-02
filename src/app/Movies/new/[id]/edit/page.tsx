import { prisma } from "@/lib/prisma";
import { MovieForm } from "@/components/movie-form";

export default async function EditMoviePage({
  params,
}: {
  params: { id: string };
}) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
  });

  if (!movie) return <div>Movie not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 font-bold">Edit Movie</h1>
      <MovieForm movie={movie} method="PUT" />
    </div>
  );
}
