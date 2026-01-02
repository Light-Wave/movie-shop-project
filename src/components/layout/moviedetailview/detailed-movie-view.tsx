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
import { Separator } from "@/components/ui/separator";
import PriceDisplay from "@/components/prise-display";
import { GenreBadge } from "@/components/genre-badge";
import { SimilarMovieCard, type SimilarMovie } from "./similar-movie-card";
import placeholder from "../../../../public/placeholders/placeholder.jpg";

import { Movie, Genre, Artist, MovieArtist } from "@/generated/prisma/client";
import { ArtistBadge } from "@/components/artist-badge";
import AddToCartButton from "@/components/cartComponents/addToCartButton";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
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
  const formattedReleaseDate = formatReleaseDate(movie.releaseDate);
  const formattedRuntime = formatRuntime(movie.runtime);

  return (
    <div className="w-full mx-auto px-0 sm:px-4 py-0 sm:py-6 md:py-8 lg:px-8">
      <Card className="shadow-2xl border-none sm:rounded-xl rounded-none overflow-hidden bg-white/50 backdrop-blur-sm p-0">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Top/Left Section -> Movie Poster */}
          <div className="w-full aspect-2/3 md:aspect-auto md:w-[400px] md:h-auto relative group shrink-0 overflow-hidden">
            {movie.imageUrl ? (
              <Image
                src={movie.imageUrl}
                alt={movie.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="relative flex items-center justify-center w-full h-full bg-muted">
                <Image
                  src={placeholder}
                  alt={movie.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Diagonal Corner Ribbon */}
            <div className="absolute -left-8 top-5 z-10 w-32 text-center transform -rotate-45 shadow-lg">
              <div
                className={`text-[10px] font-black uppercase tracking-wider px-8 py-1.5 ${
                  movie.isAvailable && (movie.stock ?? 0) > 0
                    ? "bg-green-600 text-white"
                    : "bg-red-600 text-white"
                }`}
              >
                {movie.isAvailable && (movie.stock ?? 0) > 0
                  ? "In Stock"
                  : "Out of Stock"}
              </div>
            </div>
          </div>

          {/* Content Section "right" */}
          <div className="flex-1 flex flex-col pt-4 px-5 pb-1 sm:pt-8 sm:px-8 sm:pb-4 space-y-4 sm:space-y-6 bg-gradient-to-br from-white to-zinc-50/50">
            <div className="flex-1 space-y-4 sm:space-y-6">
              <CardHeader className="p-0 text-center md:text-left items-center md:items-start">
                <CardTitle className="text-3xl sm:text-6xl font-serif font-black tracking-tight leading-tight">
                  {movie.title}
                </CardTitle>
                <CardDescription className="text-sm sm:text-lg text-zinc-500 font-medium pt-2">
                  {formattedReleaseDate} • {formattedRuntime}
                </CardDescription>

                <div className="flex flex-col gap-3 mt-4 sm:mt-6 w-full">
                  {movie.movieLinks?.filter((link) => link.role === "DIRECTOR")
                    .length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 items-center">
                      <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 w-full md:w-24 shrink-0 text-center md:text-left">
                        Director
                      </span>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {movie.movieLinks
                          .filter((link) => link.role === "DIRECTOR")
                          .map((link) => (
                            <ArtistBadge key={link.id} artist={link.artist} />
                          ))}
                      </div>
                    </div>
                  )}

                  {movie.genres?.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center gap-2 items-center">
                      <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 w-full md:w-24 shrink-0 text-center md:text-left">
                        Genres
                      </span>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {movie.genres.map((genre) => (
                          <GenreBadge key={genre.id} genre={genre} />
                        ))}
                      </div>
                    </div>
                  )}

                  {movie.movieLinks?.filter((link) => link.role === "ACTOR")
                    .length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-start items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 w-full md:w-24 shrink-0 text-center md:text-left md:pt-1">
                        Cast
                      </span>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {movie.movieLinks
                          .filter((link) => link.role === "ACTOR")
                          .map((link) => (
                            <ArtistBadge key={link.id} artist={link.artist} />
                          ))}
                      </div>
                    </div>
                  )}

                  {movie.trailerUrl && (
                    <div className="flex flex-col md:flex-row md:items-center items-center gap-2 pt-1">
                      <span className="hidden md:block text-[10px] uppercase tracking-widest font-black text-zinc-400 w-24 shrink-0 text-center md:text-left">
                        Trailer
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-fit mx-auto md:mx-0 rounded-full font-serif font-black bg-zinc-900/5 hover:bg-zinc-900/10 text-zinc-900 border-zinc-200 transition-all flex items-center gap-2 h-8 px-3"
                        asChild
                      >
                        <a
                          href={movie.trailerUrl.replace(
                            "/embed/",
                            "/watch?v="
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Play className="w-2.5 h-2.5 fill-zinc-900" />
                          <span className="text-[10px]">Watch Trailer</span>
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <div className="pt-2">
                <h3 className="text-sm uppercase tracking-widest font-black text-zinc-400 mb-3 text-center md:text-left">
                  Synopsis
                </h3>
                <p className="text-zinc-700 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto md:mx-0 text-center md:text-left">
                  {movie.description ?? "No description available."}
                </p>
              </div>
            </div>

            <div className="pt-3 sm:pt-4 border-t border-zinc-100/50">
              <div className="flex justify-between items-center w-full">
                <div className="text-xl sm:text-2xl font-black text-green-700/90 italic">
                  <PriceDisplay price={movie.price} />
                </div>
                <div className="flex">
                  <AddToCartButton
                    disabled={!movie.isAvailable || (movie.stock ?? 0) === 0}
                    movieId={movie.id}
                    className="w-auto text-sm sm:text-base h-10 sm:h-11 px-6 sm:px-8 bg-green-600 hover:bg-green-700 text-white border-none font-black transition-all shadow-xl active:scale-95"
                  />
                </div>
              </div>
            </div>
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
