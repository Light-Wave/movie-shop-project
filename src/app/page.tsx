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

import FeaturedCarousel from "@/components/layout/featuredmovie/moviecarousel";
import GenreList from "@/components/layout/genrelist/genrelist";
import MovieDisplay from "@/components/layout/moviedisplay/movie-display";
import {
  getRecentlyAddedMovies,
  getTopPurchasedMovies,
  getOldestMovies,
  getCheapestMovies,
  getMovieByTitle,
} from "@/components/sharedutils/movie-fetch";

export default async function Home() {
  // Fetch featured movies for carousel
  // TODO: Make it possible to set featured movies, either by flag in database or in admin page
  // For now, we will use a static list of movies, data is dynamic from the database
  const featuredMoviesTitles = ["warfront", "Laugh Riot", "Frozen Dreams"];
  const featuredMoviesData = await Promise.all(
    featuredMoviesTitles.map((title) => getMovieByTitle(title))
  );

  // Filter out null values to guarantee that there is a Movie to display
  const featuredMovies = featuredMoviesData.filter(
    (m): m is NonNullable<typeof m> => m !== null
  );

  // Fetch the four specific lists, passed on number is how many movies to display. the function default is 5
  const [topPurchased, recentlyAdded, oldest, cheapest] = await Promise.all([
    getTopPurchasedMovies(10),
    getRecentlyAddedMovies(10),
    getOldestMovies(10),
    getCheapestMovies(10),
  ]);

  return (
    <div className=" bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full m-auto space-y-12 py-8">
        <div>
          <h1 className="text-3xl font-bold mb-6 px-4">Featured Selection</h1>
          <FeaturedCarousel movieData={featuredMovies} />
        </div>

        <div>
          <GenreList />
        </div>

        <div className="space-y-16 pb-20">
          <section>
            <p className="italic">
              most sold section, need order data available to populate
            </p>
            {/* commented out for now, need order data available to populate */}
            {/* <MovieDisplay
              sectionTitle="Most Popular"
              movieData={topPurchased}
              isMissingData={topPurchased.length === 0}
            />*/}
          </section>

          <section>
            <MovieDisplay
              sectionTitle="Recently Added"
              movieData={recentlyAdded}
            />
          </section>

          <section>
            <MovieDisplay sectionTitle="Timeless Classics" movieData={oldest} />
          </section>

          <section>
            <MovieDisplay
              sectionTitle="Incredible Deals"
              movieData={cheapest}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
