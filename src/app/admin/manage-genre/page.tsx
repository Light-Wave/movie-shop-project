"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateGenre } from "@/server-actions/genre/update";

export function GenreUpdateForm({ genre }: { genre: any }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await updateGenre(formData);
    setLoading(false);

    if (res?.success) {
      setResult("Genre updated!");
    } else {
      setResult("Error: " + JSON.stringify(res?.errors || res?.error));
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-sm">
      {/* Hidden ID */}
      <input type="hidden" name="id" value={genre.id} />

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={genre.name ?? ""} />
      </div>

      <div>
        
        <Textarea
          id="description"
          name="description"
          defaultValue={genre.description ?? ""}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Genre"}
      </Button>

      {result && <p className="text-sm pt-2">{result}</p>}
    </form>
  );
}
