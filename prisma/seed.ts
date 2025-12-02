import fs from "node:fs";
import path from "node:path";
import { prisma } from "@/lib/prisma";
//import { prisma } from "../src/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import type { ArtistRole } from "@/generated/prisma/enums";
import type { Genre, Artist } from "@/generated/prisma/client";

// Paths to JSON files
const genresPath = path.join(__dirname, "genres.json");
const moviesPath = path.join(__dirname, "movies.json");
const artistsPath = path.join(__dirname, "artists.json");

// Load data from JSON files
const genresData: { name: string; description?: string }[] = JSON.parse(
  fs.readFileSync(genresPath, "utf-8")
);
const moviesData: {
  title: string;
  description?: string;
  price: string;
  releaseDate: string;
  stock?: number;
  runtime?: number;
  genres: string[];
  artists: { name: string; role: ArtistRole }[];
}[] = JSON.parse(fs.readFileSync(moviesPath, "utf-8"));
const artistsData: { name: string; bio?: string; imageUrl?: string | null }[] =
  JSON.parse(fs.readFileSync(artistsPath, "utf-8"));

// Ensure genres exist
async function ensureGenres(genres: typeof genresData) {
  const results: Record<string, Genre> = {};
  for (const g of genres) {
    const existing = await prisma.genre.findUnique({ where: { name: g.name } });
    results[g.name] = existing ?? (await prisma.genre.create({ data: g }));
  }
  return results;
}

// Ensure artists exist
async function ensureArtists(artists: typeof artistsData) {
  const results: Record<string, Artist> = {};
  for (const a of artists) {
    const existing = await prisma.artist.findFirst({ where: { name: a.name } });
    results[a.name] = existing ?? (await prisma.artist.create({ data: a }));
  }
  return results;
}

// Ensure movie exists
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

// Link artist to movie
async function linkArtistToMovie(
  movieId: string,
  artistId: string,
  role: ArtistRole,
  opts?: { billingOrder?: number }
) {
  const existing = await prisma.movieArtist.findFirst({
    where: { movieId, artistId, role },
  });
  if (existing) return existing;

  return prisma.movieArtist.create({
    data: { movieId, artistId, role, billingOrder: opts?.billingOrder },
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
