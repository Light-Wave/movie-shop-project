"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createGenre } from "@/server-actions/genre/create";

export default function GenreCreateForm() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createGenre(formData);

      if (res?.success) {
        toast.success("Genre created!");
        // Cant reset form as this is not a useForm hook
      } else {
        toast.error("Error creating genre", {
          description: JSON.stringify(res?.error),
        });
      }
    });
  }

  return (
    <div className="flex justify-center items-center h-full ">
      <form
        action={handleSubmit}
        className="space-y-4  w-full max-w-lg"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
        handleSubmit(formData);
        (e.target as HTMLFormElement).reset();
        }}
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Genre"}
        </Button>
      </form>
    </div>
  );
}
