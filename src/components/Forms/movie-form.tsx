"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
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

export function MovieUpdateForm({ movie }: { movie: any }) {
  const [isPending, startTransition] = useTransition();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movieArtists, setMovieArtists] = useState<
    { artistId: string; role: string }[]
  >([]);

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
    const updated = [...movieArtists];
    updated[index][field] = value;
    setMovieArtists(updated);
  };

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      formData.append("id", movie.id);
      formData.append("genres", JSON.stringify(selectedGenres));
      formData.append("artists", JSON.stringify(movieArtists));
      const res = await updateMovie(formData);

      if (res?.success) {
        toast.success("Movie updated!");
      } else {
        toast.error("Error updating movie", {
          description: JSON.stringify(res?.errors || res?.error),
        });
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit(formData);
      }}
    >
      <input type="hidden" name="id" value={movie.id} />

      {/* Grundläggande filmfält */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={movie.title ?? ""} />
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
          defaultValue={movie.price / 100}
        />
      </div>

      <div>
        <Label htmlFor="releaseDate">Release Date</Label>
        <Input
          id="releaseDate"
          name="releaseDate"
          type="date"
          defaultValue={
            movie.releaseDate
              ? new Date(movie.releaseDate).toISOString().split("T")[0]
              : ""
          }
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" name="imageUrl" defaultValue={movie.imageUrl} />
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
          defaultValue={movie.runtime}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Movie"}
      </Button>
    </form>
  );
}
