import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import pg from "pg";
import "dotenv/config";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const REALISTIC_PRICES = [999, 1299, 1499, 1999, 2499, 2999, 3999, 4999];

function getRandomPrice() {
    return REALISTIC_PRICES[Math.floor(Math.random() * REALISTIC_PRICES.length)];
}

function getRandomStock() {
    return Math.floor(Math.random() * 91) + 10;
}

async function fetchTMDBMovies(apiKey: string, count: number = 40) {
    const movieIds: number[] = [];
    console.log(`Fetching ${count} popular movies from TMDB...`);

    // TMDB returns 20 per page. For 40, we need 2 pages.
    const pagesToFetch = Math.ceil(count / 20);
    for (let p = 1; p <= pagesToFetch; p++) {
        const popularResponse = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${apiKey}&language=en-US&page=${p}`);
        if (!popularResponse.ok) throw new Error(`TMDB API error on page ${p}: ${popularResponse.statusText}`);
        const popularData = await popularResponse.json();
        movieIds.push(...popularData.results.map((m: any) => m.id));
    }

    const finalMovieIds = movieIds.slice(0, count);
    const movies = [];

    // Chunk size to be polite to TMDB API and avoid rate limits
    const CHUNK_SIZE = 5;
    for (let i = 0; i < finalMovieIds.length; i += CHUNK_SIZE) {
        const chunk = finalMovieIds.slice(i, i + CHUNK_SIZE);
        console.log(`[Progress: ${Math.round((i / finalMovieIds.length) * 100)}%] Fetching details & trailers for ${chunk.length} movies...`);

        const chunkResults = await Promise.all(chunk.map(async (id: number) => {
            const detailResponse = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${apiKey}&append_to_response=credits,videos&language=en-US`);
            if (detailResponse.ok) {
                const data = await detailResponse.json();
                // Find first YouTube trailer
                const trailer = data.videos?.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer");
                if (trailer) {
                    data.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
                }
                return data;
            }
            console.error(`Failed to fetch details for movie ID: ${id}`);
            return null;
        }));

        movies.push(...chunkResults.filter(Boolean));
        // Small delay between chunks to be extra safe with rates
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Successfully fetched details for ${movies.length} movies.`);
    return movies;
}

async function main() {
    const apiKey = "4e22fd7e18cbbdd604f531c00f9970ff";
    const artistCache = new Map<string, string>(); // Simple cache to avoid redundant DB lookups

    try {
        const moviesData = await fetchTMDBMovies(apiKey, 40);

        console.log("\n--- Starting Database Seeding ---");
        console.log("Clearing existing data...");
        await prisma.movieArtist.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.movie.deleteMany();
        await prisma.artist.deleteMany();
        await prisma.genre.deleteMany();

        console.log("Populating Genres...");
        const allGenreNames = new Set<string>();
        moviesData.forEach((m: any) => m.genres.forEach((g: any) => allGenreNames.add(g.name)));
        for (const name of allGenreNames) {
            await prisma.genre.create({ data: { name } });
        }

        console.log("Populating Movies and Artists...");
        let movieCount = 0;
        for (const mData of moviesData) {
            movieCount++;
            process.stdout.write(`[${movieCount}/${moviesData.length}] Seeding: ${mData.title}...\r`);

            const movie = await prisma.movie.create({
                data: {
                    title: mData.title,
                    description: mData.overview,
                    price: getRandomPrice(),
                    releaseDate: mData.release_date ? new Date(mData.release_date) : null,
                    imageUrl: mData.poster_path ? `https://image.tmdb.org/t/p/original${mData.poster_path}` : null,
                    trailerUrl: mData.trailerUrl || null,
                    stock: getRandomStock(),
                    runtime: mData.runtime || null,
                    genres: {
                        connect: mData.genres.map((g: any) => ({ name: g.name }))
                    }
                }
            });

            const directors = mData.credits.crew.filter((c: any) => c.job === "Director");
            const topCast = mData.credits.cast.slice(0, 5);
            const allCredits = [
                ...directors.map((d: any) => ({ ...d, role: 'DIRECTOR' })),
                ...topCast.map((a: any) => ({ ...a, role: 'ACTOR' }))
            ];

            for (const artistData of allCredits) {
                let artistId = artistCache.get(artistData.name);

                if (!artistId) {
                    // Check DB if not in cache (first occurrence)
                    let artist = await prisma.artist.findFirst({ where: { name: artistData.name } });
                    if (!artist) {
                        artist = await prisma.artist.create({
                            data: {
                                name: artistData.name,
                                imageUrl: artistData.profile_path ? `https://image.tmdb.org/t/p/original${artistData.profile_path}` : null,
                            }
                        });
                    }
                    artistId = artist.id;
                    artistCache.set(artistData.name, artistId);
                }

                await prisma.movieArtist.create({
                    data: { movieId: movie.id, artistId: artistId, role: artistData.role as any }
                });
            }
        }
        console.log("\n\nSuccessfully seeded database with TMDB data!");
    } catch (error) {
        console.error("\nSeeding failed:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
