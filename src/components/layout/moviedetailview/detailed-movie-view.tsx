"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/prise-display";
import { GenreBadge } from "@/components/genre-badge";
import { SimilarMovieCard, type SimilarMovie } from "./similar-movie-card";
import placeholder from "../../../../public/placeholders/placeholder.jpg";
import { useCartPlaceholder } from "../../../../public/placeholders/cart-placeholder";

import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";
import { ArtistBadge } from "@/components/artist-badge";
/**
 * Movie detail page props
 * @param movie movie object to display
 * @param similarMovies similar movies to display
 */
interface MovieDetailPageProps {
  movie: Movie & {
    genres: Genre[];
    movieLinks: (MovieArtist & {
      artist: Artist;
    })[];
  };
  similarMovies?: SimilarMovie[];
}

// TODO: This needs to be replaced with proper embeds from database, currently database has no youtube entries.
const DEMO_TRAILER_URL =
  "https://www.youtube.com/embed/dQw4w9WgXcQ?si=tyuXr5LIaw8VVeQA";

/**
 * Formats date, currently set to US since our default currency is $$$ <--- This might need a change if we add support for other countries.
 */
function formatReleaseDate(date: Date | null): string {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * runtime in minutes as a string
 */
function formatRuntime(runtime: number | null): string {
  return runtime ? `${runtime} min` : "N/A";
}

/**
 * Movie detail page component
 * takes in movie param to display, and similiarmovies to display recomendation.
 * Currently the recommendations are just based on the genres of the movie display
 * Added more robust handling of actors, directors and genres since the data is fetched from the outside.
 * The fetched data might include movies without director/actor or genre. we now should be ready for that.
 * It is possible that the fetched data can include a very long list of actors, but it should not completely ruin the card.
 * TODO: Adjust recommendations to be more accurate/useful?
 */
export default function MovieDetailPage({
  movie,
  similarMovies = [],
}: MovieDetailPageProps) {
  const { handleAddToCart } = useCartPlaceholder();
  const formattedReleaseDate = formatReleaseDate(movie.releaseDate);
  const formattedRuntime = formatRuntime(movie.runtime);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card className="shadow-lg border-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* Left column -> Movie poster & Availability */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full aspect-2/3 max-w-xs md:max-w-none relative rounded-lg overflow-hidden border">
              {movie.imageUrl ? (
                <Image
                  src={movie.imageUrl}
                  alt={movie.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 hover:scale-110"
                />
              ) : (
                <div className="relative flex items-center justify-center w-full h-full bg-muted">
                  <Image
                    src={placeholder}
                    alt={movie.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-300 hover:scale-110"
                  />
                </div>
              )}
            </div>

            <Badge
              className={`mt-4 text-sm font-semibold px-4 py-1 ${movie.isAvailable
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
                }`}
            >
              {movie.isAvailable ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Right side -> Title, description, price, actions */}
          <div className="md:col-span-2 space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="text-4xl font-extrabold tracking-tight">
                {movie.title}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-1">
                Released: {formattedReleaseDate} | Runtime: {formattedRuntime}
              </CardDescription>

              <div className="flex flex-col gap-3 mt-4">
                {movie.movieLinks?.filter((link) => link.role === "DIRECTOR").length > 0 && (
                  <div className="flex flex-row items-baseline gap-2">
                    <span className="text-lg font-bold w-28 shrink-0">
                      {movie.movieLinks.filter((link) => link.role === "DIRECTOR").length > 1
                        ? "Directors:"
                        : "Director:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.movieLinks
                        .filter((link) => link.role === "DIRECTOR")
                        .map((link) => (
                          <ArtistBadge key={link.id} artist={link.artist} />
                        ))}
                    </div>
                  </div>
                )}
                {movie.movieLinks?.filter((link) => link.role === "ACTOR").length > 0 && (
                  <div className="flex flex-row items-baseline gap-2">
                    <span className="text-lg font-bold w-28 shrink-0">
                      Actors:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.movieLinks
                        .filter((link) => link.role === "ACTOR")
                        .map((link) => (
                          <ArtistBadge key={link.id} artist={link.artist} />
                        ))}
                    </div>
                  </div>
                )}
                {movie.genres?.length > 0 && (
                  <div className="flex flex-row items-baseline gap-2">
                    <span className="text-lg font-bold w-28 shrink-0">
                      {movie.genres.length > 1 ? "Genres:" : "Genre:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <GenreBadge key={genre.id} genre={genre} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700 leading-relaxed">
                {movie.description ?? "No description available."}
              </p>
            </CardContent>

            <Separator />

            <CardFooter className="p-0 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-3xl font-bold text-primary">
                <PriceDisplay price={movie.price} />
              </div>
              <div className="flex space-x-3">
                <Button
                  disabled={!movie.isAvailable || (movie.stock ?? 0) === 0}
                  className="text-lg px-8 py-6"
                  onClick={(e) => handleAddToCart(e, movie.title)}
                >
                  {movie.isAvailable ? "Add to Cart" : "Notify Me"}
                </Button>
              </div>
            </CardFooter>

            {/* Trailer Section *
             * TODO -> update DEMO_TRAILER_URL to proper youtube variable from database
             */}
            {DEMO_TRAILER_URL && (
              <div className="mt-6 flex justify-center">
                <div className="w-full max-w-2xl aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg shadow-lg"
                    src={DEMO_TRAILER_URL}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Recommended Movies Section
       * Uses Genre's only to recommend other movies
       * TODO Use artists as well? - probably unnecessary, but possible if deemed needed
       */}
      {similarMovies.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 tracking-tight text-zinc-800">
            Recommended movies based on genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-stretch">
            {similarMovies.map((similarMovie) => (
              <SimilarMovieCard key={similarMovie.id} movie={similarMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
