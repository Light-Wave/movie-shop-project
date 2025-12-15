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
import { Skeleton } from "@/components/ui/skeleton";
import nosferatu from "@/components/layout/featuredmovie/nosferatu.jpg";
import { MovieSample } from "@/app/page";
import { testData } from "@/app/page";
import PriceDisplay from "@/components/prise-display";
import { GenreBadge } from "@/components/genre-badge";
import { ReducedGenre } from "@/components/types/movie";

interface MovieDetailPageProps {
  params: {
    title: string;
  };
}

export default function MovieDetailPage({ params }: MovieDetailPageProps) {
  const movie: MovieSample = (() => {
    const found = testData.find((m) => m.title === params.title);
    if (found) return found;
    // Fallback to the first test item or a minimal default
    return (
      testData[0] ?? {
        id: params.title,
        title: "Unknown Movie",
        releasedate: new Date().toISOString(),
        runtime: 0,
        isAvailable: false,
        stock: 0,
        imgURL: nosferatu,
        desc: "Details not available.",
        price: 0,
        genres: [],
      }
    );
  })();

  const formattedReleaseDate = movie.releasedate
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(movie.releasedate))
    : "N/A";

  const formattedRuntime = movie.runtime ? `${movie.runtime} min` : "N/A";

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    //TODO: Setup proper placeholder image
    e.currentTarget.src = "/placeholder-movie.jpg";
    e.currentTarget.alt = "Image failed to load, showing placeholder.";
    e.currentTarget.classList.add("object-cover", "opacity-50");
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <Card className="shadow-lg border-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          {/* "left" column -> Movie image (single for now) & Availability */}
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="w-full aspect-2/3 max-w-xs md:max-w-none relative rounded-lg overflow-hidden border">
              {movie.imgURL ? (
                <Image
                  src={movie.imgURL}
                  alt={movie.title}
                  priority
                  onError={handleImageError}
                  className="transition duration-300 hover:scale-110 h-full w-full"
                />
              ) : (
                // Fallback for when imgURL is missing
                <div className="flex items-center justify-center w-full h-full bg-muted">
                  <span className="text-muted-foreground text-center p-4">
                    No Image Available
                  </span>
                </div>
              )}
            </div>

            <Badge
              className={`mt-4 text-sm font-semibold px-4 py-1 ${
                movie.isAvailable
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {movie.isAvailable ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* "right" side -> description, title, price, buttons */}
          <div className="md:col-span-2 space-y-6">
            <CardHeader className="p-0">
              <CardTitle className="text-4xl font-extrabold tracking-tight">
                {movie.title}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground pt-1">
                Released: {formattedReleaseDate} | Runtime: {formattedRuntime}
              </CardDescription>
              <CardDescription className="text-lg text-muted-foreground pt-1">
                Producer: Massi v. Hattinen | Lead actor: Alotta Drama
              </CardDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres?.map((g) => {
                  const genreObj =
                    typeof g === "string"
                      ? { id: g, name: g }
                      : (g as ReducedGenre);
                  return <GenreBadge key={genreObj.id} genre={genreObj} />;
                })}
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <h3 className="text-xl font-semibold mb-2">Synopsis</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {movie.desc}
              </p>
            </CardContent>

            <Separator />

            <CardFooter className="p-0 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="text-3xl font-bold text-primary">
                <PriceDisplay price={movie.price} />
              </div>
              <div className="flex space-x-3">
                {/* Saved trailer button in correct place in case we decide to go back to a simpler button instead of embedded trailer.
                  // {movie.youtube && (
                  // <Button
                  //   variant="outline"
                  //   asChild
                  //   className="text-lg px-8 py-6"
                  // >
                  //   <a
                  //     href={movie.youtube}
                  //     target="_blank"
                  //     rel="noopener noreferrer"
                  //   >
                  //     Watch Trailer
                  //   </a>
                  // </Button>
                )} */}
                <Button
                  disabled={!movie.isAvailable || (movie.stock ?? 0) === 0}
                  className="text-lg px-8 py-6"
                >
                  {movie.isAvailable ? "Add to Cart" : "Notify Me"}
                </Button>
              </div>
            </CardFooter>
            {movie.youtube && (
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/wl9r4jr82sI?si=1AQqyUvFG5Wq4Idf"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      </Card>

      {/* Skeleton components and placeholders for recommended movies */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">You Might Also Like</h2>
        <p>placeholders, remember to fix</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Image
            src={testData[1].imgURL}
            alt={movie.title}
            priority
            onError={handleImageError}
            className="h-48 w-full object-contain"
          />
          <Image
            src={testData[2].imgURL}
            alt={movie.title}
            priority
            onError={handleImageError}
            className="h-48 w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
