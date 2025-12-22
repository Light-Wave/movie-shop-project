import { Badge } from "./ui/badge";
import Link from "next/link";
import { ReducedArtist, ReducedMovieLink } from "./types/movie";
import { roleToString } from "@/lib/role-to-string";

type Params =
  | (
      | {
          artist: ReducedArtist;
        }
      | { movieLink: ReducedMovieLink }
    ) & { adminView?: boolean };
export function ArtistBadge(params: Params) {
  let artist: ReducedArtist;
  if ("artist" in params) {
    artist = params.artist;
  } else {
    artist = params.movieLink.artist;
  }
  return (
    <Badge
      asChild
      variant={
        artist._count === undefined || artist._count.movieLinks > 0
          ? "default"
          : "secondary"
      }
    >
      <Link
        href={
          params.adminView
            ? `/admin/manage-artist/${artist.id}`
            : {
                pathname: "/browse",
                query: { artist: artist.name },
              }
        }
      >
        {"movieLink" in params
          ? `${roleToString(params.movieLink.role)}: ${artist.name}`
          : artist.name}
        {artist._count && artist._count.movieLinks > 0
          ? ` (${artist._count.movieLinks})`
          : ""}
      </Link>
    </Badge>
  );
}
