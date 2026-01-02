import { Badge } from "./ui/badge";
import Link from "next/link";
import { ReducedGenre } from "./types/movie";

type Params = {
  genre: ReducedGenre & { _count?: { movies: number } };
  adminView?: boolean;
};
export function GenreBadge({ genre, adminView }: Params) {
  return (
    <Badge
      asChild
      variant={
        genre._count === undefined || genre._count.movies > 0
          ? "default"
          : "secondary"
      }
      className="rounded-[12px_4px_14px_6px] text-[10px] font-bold uppercase tracking-wider shadow-sm"
    >
      <Link
        href={
          adminView
            ? `/admin/manage-genre/${genre.id}`
            : {
              pathname: "/browse",
              query: { genre: genre.name }, // TODO: make the genre id readable by humans, and use that instead
            }
        }
      >
        {genre.name}
        {genre._count && genre._count.movies > 0
          ? ` (${genre._count.movies})`
          : ""}
      </Link>
    </Badge>
  );
}
