"use client";

import { useActionState, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { addItemAction } from "@/server-actions/cart/cartActions";
import { Button } from "@/components/ui/button";

type Props = {
  movieId: string;
  className?: ComponentProps<typeof Button>["className"];
  size?: ComponentProps<typeof Button>["size"];
  disabled?: boolean;
};

function SubmitButton(props: Props) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || props.disabled}
      className={props.className}
      size={props.size}
    >
      {pending ? "Adding..." : "Add to Cart"}
    </Button>
  );
}

export default function AddToCartButton(props: Props) {
  const [state, formAction] = useActionState(addItemAction, {
    success: false,
  });

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="movieId" value={props.movieId} />
      <SubmitButton {...props} />
      {state?.success && (
        <p className="mt-1 text-sm text-green-600">Added to cart</p>
      )}
    </form>
  );
}
