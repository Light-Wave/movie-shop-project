"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMovie } from "@/server-actions/movie/update";
import { usePathname } from "next/navigation";

export default function MovieEditForm({
  movie,
  artists,
  genres,
}: {
  movie: any;
  artists: any[];
  genres: any[];
}) {
  const id = usePathname().split("/").pop() as string;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    movie.genres.map((g: any) => g.id)
  );
  const [movieArtists, setMovieArtists] = useState<
    { artistId: string; role: string }[]
  >(
    movie.movieLinks.map((ma: any) => ({
      artistId: ma.artistId,
      role: ma.role,
    }))
  );

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.append("id", id);
    formData.append("genres", JSON.stringify(selectedGenres));
    formData.append("artists", JSON.stringify(movieArtists));
    const res = await updateMovie(formData);
    setLoading(false);

    if (res?.success) {
      setResult("Movie updated!");
    } else {
      setResult("Error: " + JSON.stringify(res?.errors));
    }
  }

  const handleGenreChange = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const addArtist = () => {
    setMovieArtists([...movieArtists, { artistId: "", role: "ACTOR" }]);
  };

  const removeArtist = (index: number) => {
    setMovieArtists(movieArtists.filter((_, i) => i !== index));
  };

  const handleArtistChange = (
    index: number,
    field: "artistId" | "role",
    value: string
  ) => {
    const updatedArtists = [...movieArtists];
    updatedArtists[index][field] = value;
    setMovieArtists(updatedArtists);
  };

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required defaultValue={movie.title} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={movie.description ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          required
          defaultValue={movie.price / 100}
        />
      </div>

      <div>
        <Label htmlFor="releaseDate">Release Date</Label>
        <Input
          id="releaseDate"
          name="releaseDate"
          type="date"
          defaultValue={movie.releaseDate?.toISOString().split("T")[0]}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          defaultValue={movie.imageUrl ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          defaultValue={movie.stock}
        />
      </div>

      <div>
        <Label htmlFor="runtime">Runtime (minutes)</Label>
        <Input
          id="runtime"
          name="runtime"
          type="number"
          defaultValue={movie.runtime ?? ""}
        />
      </div>

      <div>
        <Label>Genres</Label>
        <div className="grid grid-cols-3 gap-2">
          {genres.map((genre) => (
            <div key={genre.id} className="flex items-center gap-2">
              <Checkbox
                id={`genre-${genre.id}`}
                checked={selectedGenres.includes(genre.id)}
                onCheckedChange={() => handleGenreChange(genre.id)}
              />
              <Label htmlFor={`genre-${genre.id}`}>{genre.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Artists</Label>
        {movieArtists.map((movieArtist, index) => (
          <div key={index} className="flex items-center gap-2 mt-2">
            <Select
              value={movieArtist.artistId}
              onValueChange={(value) =>
                handleArtistChange(index, "artistId", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={artist.id}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={movieArtist.role}
              onValueChange={(value) =>
                handleArtistChange(index, "role", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTOR">Actor</SelectItem>
                <SelectItem value="DIRECTOR">Director</SelectItem>
              </SelectContent>
            </Select>
            <Button
              type="button"
              onClick={() => removeArtist(index)}
              variant="destructive"
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addArtist} className="mt-2">
          Add Artist
        </Button>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Movie"}
      </Button>

      {result && <p className="text-sm pt-2">{result}</p>}
    </form>
  );
}
