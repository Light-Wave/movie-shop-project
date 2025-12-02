import { MovieForm } from "@/components/movie-form";

export default function NewMoviePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-6 font-bold">Create Movie</h1>
      <MovieForm method="POST" />
    </div>
  );
}
