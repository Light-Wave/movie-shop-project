import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/prise-display";

//Temporary filler for list and temp interface
import nosferatu from "../../layout/featuredmovie/nosferatu.jpg";
import { MovieSample } from "@/app/page";

const fillerMovie: MovieSample = {
  id: "xxx",
  title: "Filler Movie",
  imgURL: nosferatu,
  desc: "This is a filler movie used for testing the movie display component.",
  price: 199,
};

//dataHandler to ensure at least 10 movies are displayed
function dataHandler(movies: MovieSample[]) {
  const moviesCopy = [...movies];
  if (moviesCopy.length < 10) {
    while (moviesCopy.length < 10) {
      moviesCopy.push(fillerMovie);
    }
  }
  return moviesCopy;
}

export default function MovieDisplay({
  sectionTitle,
  movieData,
}: {
  sectionTitle?: string;
  movieData: MovieSample[];
}) {
  let movies: MovieSample[] = movieData;
  movies = dataHandler(movies);
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <h2>{sectionTitle}</h2>
      <CarouselContent>
        {movies.map((movie, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
            <div>
              <Card className="min-h-100 p-0">
                <CardContent className="p-1 grow flex flex-col">
                  <Image
                    src={movie.imgURL}
                    alt={`${movie.title} poster`}
                    width={200}
                    height={300}
                    className="m-auto "
                  />

                  <div className="flex flex-col gap-2 mt-2 ">
                    <CardTitle className="flex align-bottom justify-center items-end truncate">
                      {movie.title}
                    </CardTitle>
                    <p className="text-center font-bold flex justify-center rounded-full">
                      <PriceDisplay price={movie.price} />
                    </p>
                    <CardDescription className="flex items-end line-clamp-2 text-center bg-amber-50">
                      {movie.desc}
                    </CardDescription>
                    <CardFooter className="flex justify-center items-end">
                      <Button className="align-bottom">Add to Cart</Button>
                    </CardFooter>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 absolute left-0 top-1/2 -translate-y-1/2 rounded-full">
        ‹
      </CarouselPrevious>
      <CarouselNext className="bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 absolute right-0 top-1/2 -translate-y-1/2 rounded-full">
        ›
      </CarouselNext>
    </Carousel>
  );
}
