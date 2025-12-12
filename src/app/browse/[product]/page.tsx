//✅ View detailed movie information
// Add movies to cart (stored in cookies)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// ✅ Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

import { testData, MovieSample } from "@/app/page";
import MovieDetailPage from "@/components/layout/moviedetailview/moviedetailview";

function normalizeForMatch(s: string | undefined) {
  if (!s) return "";
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function DetailPage({
  params,
}: {
  params: Promise<{ product: string }>;
}) {
  const rawParam = (await params).product;
  const paramNormalized = normalizeForMatch(rawParam);

  // Try to find a matching movie by normalized title, slug, or id
  const matched: MovieSample | undefined = testData.find((m: any) => {
    const titleNorm = normalizeForMatch(m.title ?? "");
    const slugNorm = normalizeForMatch((m as any).slug ?? "");
    const idNorm = normalizeForMatch((m as any).id?.toString?.() ?? "");

    return (
      paramNormalized === titleNorm ||
      paramNormalized === slugNorm ||
      paramNormalized === idNorm ||
      // also allow direct lowercase title match without normalization
      rawParam.toLowerCase() ===
        (m.title ?? m.name ?? "").toString().toLowerCase()
    );
  });

  if (!matched) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-center">
          Product not found: {rawParam}
        </h1>
      </div>
    );
  }

  return (
    <div>
      <MovieDetailPage params={{ id: matched.title }} />
    </div>
  );
}
