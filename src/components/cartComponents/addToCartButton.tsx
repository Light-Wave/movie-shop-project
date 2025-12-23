"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addItemAction } from "@/server-actions/cart/cartActions";
import { Button } from "@/components/ui/button";

type Props = {
  movieId: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

export default function AddToCartButton({ movieId }: Props) {
  const [state, formAction] = useFormState(addItemAction, {
    success: false,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="movieId" value={movieId} />
      <SubmitButton />
      {state?.success && (
        <p className="mt-1 text-sm text-green-600">
          Added to cart
        </p>
      )}
    </form>
  );
}
