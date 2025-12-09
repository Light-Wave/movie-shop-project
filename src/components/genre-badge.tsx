import { Badge } from "./ui/badge";
import Link from "next/link";
import { ReducedGenre } from "./types/movie";

type Params = {
  genre: ReducedGenre & { _count?: { movies: number } };
};
export function GenreBadge({ genre }: Params) {
  return (
    <Badge
      asChild
      variant={
        genre._count === undefined || genre._count.movies > 0
          ? "default"
          : "secondary"
      }
    >
      <Link
        href={{
          pathname: "/browse",
          query: { genre: genre.name }, // TODO: make the genre id readable by humans, and use that instead
        }}
      >
        {genre.name}
        {genre._count && genre._count.movies > 0
          ? ` (${genre._count.movies})`
          : ""}
      </Link>
    </Badge>
  );
}
