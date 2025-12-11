//✅ Landing page
//✅ o Top 5 most purchased movie - Partially done, needs data integration
//✅ o Top 5 most recent movies - Partially done, needs data integration
//✅ o Top 5 Oldest Movies - Partially done, needs data integration
//✅ o Top 5 cheapest Movie - Partially done, needs data integration
// Optional Implement a simple recommendation system based on user purchase
// history, favorite genres, directors, or actors
// Add movies to cart (stored in cookies)
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

// Testdata images, import unneeded in final version
import nosferatu from "../components/layout/featuredmovie/nosferatu.jpg";
import superman from "../components/layout/featuredmovie/superman.jpg";
import minecraft from "../components/layout/featuredmovie/minecraft.jpg";

// Temporary Interface for test data
export interface MovieSample {
  id: string;
  releasedate?: Date;
  stock?: number;
  runtime?: number;
  isAvailable?: boolean;
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  movieLinks?: string;
  title: string;
  imgURL: any;
  youtube?: string;
  desc: string;
  price: number;
  genres?: string[];
}
// Temporary test data
export const testData: MovieSample[] = [
  {
    id: "1",
    title: "Nosferatu",
    imgURL: nosferatu,
    desc: "A classic silent horror about the mysterious Count Nosferatu invading a small town.",
    price: 999,
    releasedate: new Date("1922-03-04"),
    stock: 5,
    runtime: 94,
    isAvailable: true,
    createdAt: new Date("2020-01-10T08:30:00Z"),
    updatedAt: new Date("2024-06-01T12:00:00Z"),
    movieLinks: "https://example.com/movies/nosferatu",
    youtube: "https://www.youtube.com/embed/nulvWqYUM8k?si=PvkV0mi0xJGm5DWK",
    genres: ["Horror", "Silent", "Classic"],
  },
  {
    id: "2",
    title: "Superman",
    imgURL: superman,
    desc: "The iconic superhero film that introduced Superman to the silver screen.",
    price: 1499,
    releasedate: new Date("1978-12-15"),
    stock: 12,
    runtime: 143,
    isAvailable: true,
    createdAt: new Date("2021-05-22T09:15:00Z"),
    updatedAt: new Date("2024-05-20T14:45:00Z"),
    movieLinks: "https://example.com/movies/superman",
    youtube: "https://www.youtube.com/embed/Ox8ZLF6cGM0?si=gURfrdWW-I7gCJvh",
    genres: ["Action", "Adventure", "Superhero"],
  },
  {
    id: "3",
    title: "Minecraft",
    imgURL: minecraft,
    desc: "An imaginative blocky world brought to life in a family-friendly adventure.",
    price: 1999,
    releasedate: new Date("2024-07-01"),
    stock: 0,
    runtime: 105,
    isAvailable: false,
    createdAt: new Date("2024-02-12T11:00:00Z"),
    updatedAt: new Date("2024-09-01T10:00:00Z"),
    movieLinks: "https://example.com/movies/minecraft",
    youtube: "https://www.youtube.com/embed/wJO_vIDZn-I?si=n343Ixvb6AcfsAZx",
    genres: ["Family", "Adventure", "Fantasy"],
  },
];
//Imports for final landingpage
import FeaturedCarousel from "@/components/layout/featuredmovie/moviecarousel";
import GenreList from "@/components/layout/genrelist/genrelist";
import MovieDisplay from "@/components/layout/moviedisplay/moviedisplay";

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      <main className="w-9/10 m-auto">
        <div>
          <FeaturedCarousel movieData={testData} />
        </div>
        <div>
          <GenreList />
        </div>
        <div className="my-8">
          <MovieDisplay
            sectionTitle="Most Purchased Movies"
            movieData={testData}
          />
        </div>

        <h1 className="text-3xl font-bold mb-4">Start of mainpage content</h1>
        <p className="text-muted-foreground">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
          provident a officiis, impedit deleniti odio tenetur id perferendis,
          itaque aut veritatis consequuntur quae laboriosam in ullam tempora,
          dolorum officia esse excepturi fuga. Possimus minus provident nesciunt
          natus! Sed vel quam fuga, tempora magni totam consequatur reiciendis
          provident asperiores, perspiciatis maiores.
        </p>
      </main>
    </div>
  );
}
