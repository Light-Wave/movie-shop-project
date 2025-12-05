// Add new movies with details (title, description, price, release date,
// director, actors, etc.)

"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createMovie } from "@/server-actions/movie/create";

export default function MovieCreateForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createMovie(formData);
    setLoading(false);

    if (res?.success) {
      setResult("Movie created!");
    } else {
      setResult("Error: " + JSON.stringify(res?.error));
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-lg">
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

      <Button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Movie"}
      </Button>

      {result && <p className="text-sm pt-2">{result}</p>}
    </form>
  );
}
