import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ManageGenrePage() {
  const genres = await prisma.genre.findMany();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Genres</h1>
        <Button asChild>
          <Link href="/admin/manage-genre/new">Create New Genre</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {genres.map((genre) => (
          <div key={genre.id} className="flex items-center justify-between p-2 border rounded-md">
            <div>{genre.name}</div>
            <Button asChild variant="outline">
              <Link href={`/admin/manage-genre/${genre.id}`}>Edit</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
