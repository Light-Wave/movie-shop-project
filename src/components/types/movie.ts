import { Artist, Genre, Movie, MovieArtist } from "@/generated/prisma/client";

export type ReducedGenre = Pick<Genre, "id" | "name">;
export type ReducedMovieLink = Pick<MovieArtist, "role"> & {
  artist: ReducedArtist;
};
export type ReducedArtist = Pick<Artist, "id" | "name"> & {
  _count?: { movieLinks: number };
};

export type MovieWithDetails = Movie & {
  genres: ReducedGenre[];
  movieLinks: ReducedMovieLink[];
};
