// Browse movies (optional filtering)
// o By genre
// o By director
// o By actor
//  Search functionality for movies (basic search by title)

// Add movies to cart (stored in cookies)

// Optional - Implement more complex filters (e.g., release year range, runtime, multiple genres)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

/*
Optinal:
7. Advanced Search
o Implement full-text search for movies using PostgreSQL's full-text search
capabilities
o Include search by director, actor, and genre*/
import { MovieTable } from "@/components/movie-browser";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { prisma } from "@/lib/prisma";
import { ChevronsUpDown } from "lucide-react";

export default async function Dashboard() {
  const moviePromise = prisma.movie.findMany({ include: { genres: true } });
  const genrePromise = prisma.genre.findMany();
  const [movies, genres] = await Promise.all([moviePromise, genrePromise]);
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      <main className="w-9/10 m-auto">
        <Collapsible>
          <Button variant="outline" className="mb-4 mt-4" asChild>
            <CollapsibleTrigger>
              Genres <ChevronsUpDown />
            </CollapsibleTrigger>
          </Button>
          <CollapsibleContent>
            <div className="space-x-1">
              {genres.map((genre) => (
                <Badge key={genre.id}>{genre.name}</Badge>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <MovieTable data={movies} />
      </main>
    </div>
  );
}
