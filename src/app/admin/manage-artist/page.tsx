import { prisma } from "@/lib/prisma";
import { UpdateArtistForm } from "@/components/admin/artist-form-client";

async function getArtists() {
  return prisma.artist.findMany();
}

export default async function ManageArtistsPage() {
  const artists = await getArtists();

  return (
    <div>
      <h1>Manage Artists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <div key={artist.id} className="p-4 border rounded-lg">
            <UpdateArtistForm artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
}