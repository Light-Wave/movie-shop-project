"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createGenre } from "@/server-actions/genre/create";

export default function GenreCreateForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await createGenre(formData);
    setLoading(false);

    if (res?.success) {
      setResult("Genre created!");
    } else {
      setResult("Error: " + JSON.stringify(res?.error));
    }
  }

  return (
    <div className="flex justify-center items-center h-full ">
      <form action={handleSubmit} className="space-y-4  w-full max-w-lg">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Genre"}
        </Button>

        {result && <p className="text-sm pt-2">{result}</p>}
      </form>
    </div>
  );
}
