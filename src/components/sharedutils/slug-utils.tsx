/* Utilities for handling slugs, so to not have multiple cases in the seperate files
 * TODO - Make sure there are no duplicate code in the current pages
 * Standard format is right now .../Browse/UUID-TITLE
 * This might need to be changed, depending on how we decide to show the slug, the UIUD is not exactly pretty
 */

/**
 * Normalize a title for URL slugs
 * Converts to lowercase
 * Trims whitespace
 * Replaces non-alphanumeric characters with hyphens
 * Removes leading/trailing hyphens
 */
export function normalizeToSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Normalize a title for search comparison
 * Converts to lowercase
 * Trims whitespace
 * Replaces non-alphanumeric characters with spaces
 * Collapses multiple spaces <- needed since spaces can be added with .replace
 *
 */
export function normalizeForSearch(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * UUID validation regex pattern
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check if a string is a valid UUID format
 */
export function isUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

/**
 * Generate a full movie URL with ID and slug
 * create the default URL makeup (UUID - Title)
 */
export function generateMovieUrl(movieId: string, title: string): string {
  const slug = normalizeToSlug(title ?? "");
  return `/browse/${movieId}-${slug}`;
}
