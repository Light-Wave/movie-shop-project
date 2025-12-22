import Link from "next/link";
import { getTopGenres } from "@/components/sharedutils/genre-fetch";
import { GenreCarousel } from "./genre-carousel";

/**
 * Fetches 12 genres ordered by the number of movies in each genre from the database and diplays them in a grid.
 * TODO: Maybe rebuild to check for size of screen and fetching as many genres as can fit.
 */
export default async function GenreList() {
  const genres = await getTopGenres(12);

  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-2xl font-bold tracking-tight">Popular Genres</h2>
        <Link className="hover:underline text-sm font-medium" href="/browse">
          View All
        </Link>
      </div>

      <div>
        <GenreCarousel genres={genres} />
      </div>
    </div>
  );
}
