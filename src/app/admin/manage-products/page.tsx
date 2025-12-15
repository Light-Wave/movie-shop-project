import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ManageProductsPage() {
  const movies = await prisma.movie.findMany({
    include: {
      genres: true,
      movieArtists: {
        include: {
          artist: true,
        },
      },
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Movies</h1>
        <Button asChild>
          <Link href="/admin/manage-products/new">Create New Movie</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {movies.map((movie) => (
          <div key={movie.id} className="flex items-center justify-between p-2 border rounded-md">
            <div>{movie.title}</div>
            <Button asChild variant="outline">
              <Link href={`/admin/manage-products/${movie.id}`}>Edit</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
