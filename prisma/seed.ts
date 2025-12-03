import fs from "node:fs";
import path from "node:path";
import { Prisma } from "../src/generated/prisma/client";
import { prisma } from "../src/lib/prisma";
import type { ArtistRole } from "../src/generated/prisma/enums";
import type { Genre, Artist } from "../src/generated/prisma/client";
import "dotenv/config";

// Use the shared Prisma client exported from `src/lib/prisma`

// Paths to JSON files
const genresPath = path.join(__dirname, "genres.json");
const moviesPath = path.join(__dirname, "movies.json");
const artistsPath = path.join(__dirname, "artists.json");

// Load data from JSON files
const genresData: Pick<Genre, "name" | "description">[] = JSON.parse(
  fs.readFileSync(genresPath, "utf-8")
);
type MovieSeed = {
  title: string;
  description?: string;
  price: string;
  releaseDate: string;
  stock?: number;
  runtime?: number;
  genres: string[];
  artists?: { name: string; role: ArtistRole }[];
};

const moviesData: MovieSeed[] = JSON.parse(
  fs.readFileSync(moviesPath, "utf-8")
);
const artistsData: Pick<Artist, "name" | "bio" | "imageUrl">[] = JSON.parse(
  fs.readFileSync(artistsPath, "utf-8")
);

async function ensureGenres(genres: typeof genresData) {
  const results: Record<string, Genre> = {};
  for (const g of genres) {
    const existing = await prisma.genre.findUnique({ where: { name: g.name } });
    results[g.name] = existing ?? (await prisma.genre.create({ data: g }));
  }
  return results;
}

async function ensureArtists(artists: typeof artistsData) {
  const results: Record<string, Artist> = {};
  for (const a of artists) {
    const existing = await prisma.artist.findFirst({ where: { name: a.name } });
    results[a.name] = existing ?? (await prisma.artist.create({ data: a }));
  }
  return results;
}

async function ensureMovie(movie: (typeof moviesData)[0]) {
  const relDate = new Date(movie.releaseDate);
  const existing = await prisma.movie.findFirst({
    where: { title: movie.title, releaseDate: relDate },
  });
  if (existing) return existing;

  return prisma.movie.create({
    data: {
      title: movie.title,
      description: movie.description,
      price: new Prisma.Decimal(movie.price),
      releaseDate: relDate,
      stock: movie.stock ?? 0,
      runtime: movie.runtime,
      genres: {
        connect: movie.genres.map((name) => ({ name })),
      },
    },
  });
}
async function linkArtistToMovie(
  movieId: string,
  artistId: string,
  role: ArtistRole
) {
  const existing = await prisma.movieArtist.findFirst({
    where: { movieId, artistId, role },
  });
  if (existing) return existing;

  return prisma.movieArtist.create({
    data: { movieId, artistId, role },
  });
}

async function main() {
  if ((process.env.NODE_ENV || "").toLowerCase() === "production") {
    console.error("Refusing to run seed in production.");
    process.exit(1);
  }

  console.log("Seeding genres...");
  await ensureGenres(genresData);

  console.log("Seeding artists...");
  const artistsByName = await ensureArtists(artistsData);

  console.log("Seeding movies and linking artists...");
  for (const movie of moviesData) {
    const createdMovie = await ensureMovie(movie);

    if (movie.artists && movie.artists.length > 0) {
      for (const a of movie.artists) {
        const artist = artistsByName[a.name];
        if (artist) {
          await linkArtistToMovie(createdMovie.id, artist.id, a.role);
        } else {
          console.warn(`Artist ${a.name} not found for movie ${movie.title}`);
        }
      }
    }
  }

  console.log("Seeding completed.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
