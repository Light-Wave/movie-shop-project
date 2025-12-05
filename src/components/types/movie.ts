import { Genre, Movie } from "@/generated/prisma/client";

export type MovieWithGenres = Movie & {
  genres: Genre[];
};
