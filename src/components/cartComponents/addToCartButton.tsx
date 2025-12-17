
// src/components/cartComponents/AddToCartButton.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function AddToCartButton({
  movieId,
  addItemAction,
  className,
}: {
  movieId: string;
  addItemAction: (formData: FormData) => Promise<void>; // Server Action passed from a Server Component
  className?: string;
}) {
  console.log("🟢 AddToCartButton addItemAction typeof:", typeof addItemAction, "movieId:", movieId);

  return (
    <form>
      {/* The Server Action will read this from FormData */}
      <input type="hidden" name="movieId" value={movieId} />
      {/* ✅ per-button action is robust in popovers/portals */}
      <Button formAction={addItemAction} type="submit" className={className}>
        Add to Cart
      </Button>
    </form>
  );
}
