import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany();

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <Link href="/movies/new" className="underline">
          New Movie
        </Link>
      </div>

      <ul className="space-y-2">
        {movies.map((m) => (
          <li key={m.id} className="p-4 border rounded">
            <div className="font-semibold">
              {m.title} ({m.releaseDate && format(new Date(m.releaseDate), "yyyy")})
            </div>
            <Link
              href={`/movies/${m.id}/edit`}
              className="text-blue-600 underline"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
