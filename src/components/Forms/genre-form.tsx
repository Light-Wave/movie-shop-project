"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateGenre } from "@/server-actions/genre/update";

export function GenreUpdateForm({ genre }: { genre: any }) {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await updateGenre(formData);

      if (res?.success) {
        toast.success("Genre updated!");
      } else {
        toast.error("Error updating genre", {
          description: JSON.stringify(res?.errors || res?.error),
        });
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleSubmit(formData);
      }}
    >
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Updating..." : "Update Genre"}
      </Button>
    </form>
  );
}
