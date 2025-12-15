import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

// Temporary Interface for test data
import { MovieSample } from "@/app/page";

export default function FeaturedCarousel({
  movieData,
}: {
  movieData: MovieSample[];
}) {
  return (
    <div className="mx-auto max-w-4xl shadow-2xl rounded-xl sm:shadow-none">
      <Carousel className="w-full">
        <CarouselContent>
          {movieData.map((movie, index) => (
            <CarouselItem
              key={index}
              className="flex flex-col h-[700px] sm:flex-row sm:h-[500px] justify-between p-4 sm:p-8 bg-white rounded-xl"
            >
              <div className="w-full h-1/2 sm:w-1/3 sm:h-full flex justify-center items-center p-2 sm:p-0">
                <Card className=" border-2 border-gray-100 rounded-lg p-3 w-[95%] h-[95%] sm:shadow-lg sm:border-0 sm:p-0">
                  <CardContent className="h-full w-full p-0 flex justify-center items-center">
                    <div className="relative w-full h-full">
                      <Image
                        src={movie.imgURL}
                        alt={`${movie.title} poster`}
                        width={400}
                        height={500}
                        className="w-full h-full max-h-full object-contain rounded-md"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full h-1/2 sm:w-2/3 sm:h-full flex flex-col justify-center items-center p-6 space-y-4">
                <CardTitle className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {movie.title}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-gray-600 max-w-lg text-center">
                  {movie.desc} <br />
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </CardDescription>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
