import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

//Temporary filler for list and temp interface
import nosferatu from "../../layout/featuredmovie/nosferatu.jpg";
import { MovieSample } from "@/app/page";

const fillerMovie: MovieSample = {
  title: "Filler Movie",
  imgLink: nosferatu,
  desc: "This is a filler movie used for testing the movie display component.",
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
      <div>
        <h2>{sectionTitle}</h2>
        <CarouselContent>
          {movies.map((movie, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/5">
              <div className="">
                <Card>
                  <CardContent className="">
                    <Image
                      src={movie.imgLink}
                      alt={`${movie.title} poster`}
                      className="object-contain w-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold truncate">
                        {movie.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {movie.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </div>
    </Carousel>
  );
}
