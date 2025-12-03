// Landing page
// o Top 5 most purchased movie
// o Top 5 most recent movies
// o Top 5 Oldest Movies
// o Top 5 cheapest Movie
// Optional Implement a simple recommendation system based on user purchase
// history, favorite genres, directors, or actors

import { FeaturedCarousel } from "@/components/layout/featuredmovie/moviecarousel";

// Add movies to cart (stored in cookies)
// Optional Enable users to add movies to a wishlist for future purchase
// Optinal Add functionality to link and display movie trailers (embedded YouTube videos)
// Optinal Add buttons to share movie links on social media platforms

export default function Home() {
  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      <main className="w-9/10 m-auto">
        <FeaturedCarousel />
        <div>
          <h1 className="text-3xl font-bold mb-4">Start of mainpage content</h1>
          <p className="text-muted-foreground">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique
            provident a officiis, impedit deleniti odio tenetur id perferendis,
            itaque aut veritatis consequuntur quae laboriosam in ullam tempora,
            dolorum officia esse excepturi fuga. Possimus minus provident
            nesciunt natus! Sed vel quam fuga, tempora magni totam consequatur
            reiciendis provident asperiores, perspiciatis maiores.
          </p>
        </div>
      </main>
    </div>
  );
}
