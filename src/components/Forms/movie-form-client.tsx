"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMovie } from "@/server-actions/movie/create";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Artist, Genre } from "@/generated/prisma/client";

export default function MovieCreateForm({
  artists,
  genres,
}: {
  artists: Artist[];
  genres: Genre[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movieArtists, setMovieArtists] = useState<
    { artistId: string; role: string }[]
  >([]);

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      formData.append("genres", JSON.stringify(selectedGenres));
      formData.append("artists", JSON.stringify(movieArtists));
      const res = await createMovie(formData);

      if (res?.success) {
        toast.success("Movie created!");
        // Cant reset form as this is not a useForm hook
      } else {
        toast.error("Error creating movie", {
          description: JSON.stringify(res?.error),
        });
      }
    });
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
    <div className="flex justify-center items-center h-full ">
      <form
        action={handleSubmit}
        className="space-y-4 w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit(formData);
          (e.target as HTMLFormElement).reset();
        }}
      >
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>

        <div>
          <Label htmlFor="releaseDate">Release Date</Label>
          <Input id="releaseDate" name="releaseDate" type="date" />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" />
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" defaultValue={0} />
        </div>

        <div>
          <Label htmlFor="runtime">Runtime (minutes)</Label>
          <Input id="runtime" name="runtime" type="number" />
        </div>

        <div>
          <Label>Genres</Label>
          <div className="grid grid-cols-3 gap-2">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center gap-2">
                <Checkbox
                  id={`genre-${genre.id}`}
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

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Movie"}
        </Button>
      </form>
    </div>
  );
}
