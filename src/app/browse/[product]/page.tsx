// View detailed movie information
// Add movies to cart (stored in cookies)
// Optional Allow customers to rate and review purchased movies
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms
import { testData, MovieSample } from "@/app/page";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/prise-display";
<<<<<<< HEAD
import { Badge } from "@/components/ui/badge";
import MovieDetailPage from "@/components/layout/moviedetail/singlemoviepage";
=======
>>>>>>> c2ec78e8f60476a9ac5b15ec02dfaa7f17ffec3b

function normalizeForMatch(s: string | undefined) {
  if (!s) return "";
  return s
    .toString()
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
    const titleNorm = normalizeForMatch(m.title ?? m.name ?? "");
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
    return <div>Product not found: {rawParam}</div>;
  }

  return (
<<<<<<< HEAD
    <div className="grid grid-cols-5 grid-rows-4 gap-4 p-4 border-2 border-grey-800 rounded-lg">
      <div className="row-span-4">
        <Image src={matched.imgURL} alt={matched.title} />
=======
    <div className="grid grid-cols-5 grid-rows-5 gap-4 p-4 border-2 border-grey-800 rounded-lg">
      <div className="row-span-4">
        <Image src={matched.imgLink} alt={matched.title} />
>>>>>>> c2ec78e8f60476a9ac5b15ec02dfaa7f17ffec3b
        {matched.youtube ? (
          <Link
            href={String(matched.youtube)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Watch Trailer
          </Link>
        ) : null}
      </div>
      <div className="col-span-3 row-span-4">
        <h1>{matched.title}</h1>
        <p>{matched.desc}</p>
      </div>

      <div className="row-span-4 col-start-5">
        <div className="flex flex-col gap-1 bg-gray-200 p-1 rounded-lg h-full">
<<<<<<< HEAD
          {matched.genres?.map((mg, index) => (
            <Badge key={index} className="mx-auto px-5">
              {mg}{" "}
            </Badge>
          ))}
          <p className="text-center">
            Release date:
            {matched.releasedate
              ? matched.releasedate instanceof Date
                ? matched.releasedate.toLocaleDateString()
                : String(matched.releasedate)
              : ""}
          </p>

=======
          {matched.genres?.map((mn, index) => (
            <p
              key={index}
              className="bg-black text-white p-1 text-center rounded-2xl"
            >
              {mn}{" "}
            </p>
          ))}
>>>>>>> c2ec78e8f60476a9ac5b15ec02dfaa7f17ffec3b
          <Button className="mt-auto w-full justify-center">
            Add to Cart - <PriceDisplay price={matched.price} />
          </Button>
        </div>
      </div>
<<<<<<< HEAD
      <div>{/* <MovieDetailPage params={{ id: "tt0120737" }} /> */}</div>
=======
>>>>>>> c2ec78e8f60476a9ac5b15ec02dfaa7f17ffec3b
    </div>
  );
}
