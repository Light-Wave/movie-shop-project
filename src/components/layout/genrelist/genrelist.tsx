import Link from "next/link";

export default function GenreList() {
  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4">Genres</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <li className="bg-white p-4 rounded shadow">Action</li>
        <li className="bg-white p-4 rounded shadow">Comedy</li>
        <li className="bg-white p-4 rounded shadow">Drama</li>
        <li className="bg-white p-4 rounded shadow">Horror</li>
        <li className="bg-white p-4 rounded shadow">Sci-Fi</li>
        <li className="bg-white p-4 rounded shadow">Romance</li>
      </ul>
      <Link className="text-primary hover:underline" href="/genres">
        View All Genres
      </Link>
    </div>
  );
}
