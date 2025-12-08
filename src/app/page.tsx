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
  title: string;
  imgLink: any;
  youtube?: string;
  desc: string;
  price: number;
}
// Temporary test data
const testData: MovieSample[] = [
  {
    title: "Nosferatu",
    imgLink: nosferatu,
    desc: "A classic horror movie about a vampire.",
    price: 9.99,
  },
  {
    title: "Superman",
    imgLink: superman,
    desc: "The iconic superhero film, featuring the adventures of Superman.",
    price: 14.99,
  },
  {
    title: "Minecraft",
    imgLink: minecraft,
    desc: "A movie adaptation of the popular video game.",
    price: 19.99,
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
