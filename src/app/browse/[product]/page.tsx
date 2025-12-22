//✅ View detailed movie information
// Add movies to cart (stored in cookies) TODO add actual function
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// ✅ Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

import React from "react";
import { redirect } from "next/navigation";
import {
  getMovieByFlexibleParam,
  getSimilarMoviesByGenres,
} from "@/components/sharedutils/movie-fetch";
import MovieDetailPage from "@/components/layout/moviedetailview/detailed-movie-view";
import MovieNotFound from "@/components/layout/moviedetailview/movie-not-found";
import {
  normalizeToSlug,
  generateMovieUrl,
} from "@/components/sharedutils/slug-utils";

interface PageParams {
  params: Promise<{ product: string }>;
}

/**
 * Movie Detail Page
 * Handles fetching movie by ID or title
 */
export default async function DetailPage({
  params,
}: PageParams): Promise<React.ReactNode> {
  const { product } = await params;

  // Attempt to find the movie by either its UUID or its title
  const movie = await getMovieByFlexibleParam(product);

  if (!movie) {
    return <MovieNotFound searchTerm={product} />;
  }

  /*changes the URL to match pattern UUID - Title
   */
  const expectedParam = `${movie.id}-${normalizeToSlug(movie.title ?? "")}`;
  if (product !== expectedParam) {
    redirect(generateMovieUrl(movie.id, movie.title));
  }

  // Fetch similar movies based on genres (server-side pre-fetching)
  const genreIds = movie.genres.map((g) => g.id);
  const similarMovies = await getSimilarMoviesByGenres(movie.id, genreIds, 6);

  return <MovieDetailPage movie={movie} similarMovies={similarMovies} />;
}
