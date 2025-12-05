"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateMovie } from "@/server-actions/movie/update";

export function MovieUpdateForm({ movie }: { movie: any }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateMovie(formData);
    setLoading(false);

    if (res?.success) {
      setResult("Movie updated!");
    } else {
      setResult("Error: " + JSON.stringify(res?.errors || res?.error));
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
      {/* Hidden movie ID */}
      <input type="hidden" name="id" value={movie.id} />

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
          defaultValue={movie.price ?? ""}
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
          defaultValue={movie.stock ?? ""}
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

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Movie"}
      </Button>

      {result && <p className="text-sm pt-2">{result}</p>}
    </form>
  );
}
