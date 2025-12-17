//✅ View detailed movie information
// Add movies to cart (stored in cookies)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// ✅ Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

"use server";

import React from "react";
import { redirect } from "next/navigation";
import {
  getMovieById,
  getMovieByTitle,
  getSimilarMoviesByGenres,
} from "@/components/layout/moviedetailview/detailed-movie-fetch";
import MovieDetailPage from "@/components/layout/moviedetailview/detailed-movie-view";
import MovieNotFound from "@/components/layout/moviedetailview/movie-not-found";
import { normalizeToSlug } from "@/components/sharedutils/slug-utils";

/* NOTE: the UUID portion of this is completely stolen and I cant fully explain how it works, more then in very general terms.
// The entire UUID part can probably be removed, right now we use a "UUID - Title" format that probably is overkill
// A decision should be made if we are to only search for title, or a combination of terms
*/

// UUID validation regex pattern
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if a string is a valid UUID format
 */
function isUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

/**
 * Generate the canonical URL for a movie
 */
function getCanonicalUrl(id: string, title: string): string {
  const slug = normalizeToSlug(title ?? "");
  return `/browse/${id}-${slug}`;
}

interface PageParams {
  params: Promise<{ product: string }>;
}

export default async function DetailPage({
  params,
}: PageParams): Promise<React.ReactNode> {
  const { product } = await params;

  /* Try to extract UUID from the beginning of the param
  // Format could be: "uuid", "uuid-slug", or "human-readable-title"
  // Unsure this is actually needed since we dont expect a user to wrote an actual UUID
  */
  const parts = product.split("-");

  // Check if first 5 parts form a valid UUID (uuid has 5 segments separated by hyphens)
  const potentialUUID = parts.slice(0, 5).join("-");

  if (isUUID(potentialUUID)) {
    // We have a UUID - fetch movie by ID
    const id = potentialUUID;
    const slug = parts.slice(5).join("-");
    const movie = await getMovieById(id);

    if (!movie) {
      return <MovieNotFound searchTerm={slug || id} />;
    }

    // Validate and redirect to canonical URL if slug is incorrect
    const expectedSlug = normalizeToSlug(movie.title ?? "");
    if (slug && slug !== expectedSlug) {
      redirect(getCanonicalUrl(id, movie.title));
    }

    // Fetch similar movies based on genres
    const genreIds = movie.genres.map((g) => g.id);
    const similarMovies = await getSimilarMoviesByGenres(movie.id, genreIds, 6);

    return <MovieDetailPage movie={movie} similarMovies={similarMovies} />;
  }

  // No valid UUID - treat the entire param as a title search
  const movie = await getMovieByTitle(product);

  if (!movie) {
    return <MovieNotFound searchTerm={product} />;
  }

  // Redirect to the canonical URL format (id-slug)
  redirect(getCanonicalUrl(movie.id, movie.title));
}
