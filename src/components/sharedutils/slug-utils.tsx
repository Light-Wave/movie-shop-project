/* Utilities for handling slugs, so to not have multiple cases in the seperate files
 *TODO - Make sure there are no duplicate code in the current pages
 * Standard format is right now .../Browse/UUID-TITLE
 * This might need to be changed, depending on how we decide to show the slug, the UIUD is not exactly pretty
 */

/**
 * Normalize a title for URL slugs
 * - Converts to lowercase
 * - Trims whitespace
 * - Replaces non-alphanumeric characters with hyphens
 * - Removes leading/trailing hyphens
 *
 * @param title - The title to normalize
 * @returns The normalized slug string
 */
export function normalizeToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
}

/**
 * Normalize a title for search comparison
 * - Converts to lowercase
 * - Trims whitespace
 * - Replaces non-alphanumeric characters with spaces
 * - Collapses multiple spaces
 *
 * @param title - The title to normalize
 * @returns The normalized search string
 */
export function normalizeForSearch(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ") // replace non-alphanumeric with space
    .replace(/\s+/g, " ") // collapse multiple spaces
    .trim();
}

/**
 * Generate a full movie URL with ID and slug
 *
 * @param movieId - The movie's unique identifier
 * @param title - The movie's title
 * @returns The formatted URL path
 */
export function generateMovieUrl(movieId: string, title: string): string {
  const slug = normalizeToSlug(title);
  return `/browse/${movieId}-${slug}`;
}
