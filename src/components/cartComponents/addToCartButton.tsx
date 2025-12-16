"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function AddToCartButton({
  movieId,
  onAdd,                   // the server action comes in as a prop..
  className,
}: {
  movieId: string;
  onAdd: (formData: FormData) => Promise<void>;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <form action={onAdd}>
      <input type="hidden" name="movieId" value={movieId} />
      <Button type="submit" className={className} disabled={pending}>
        {pending ? "Adding…" : "Add to Cart"}
      </Button>
    </form>
  );
}
