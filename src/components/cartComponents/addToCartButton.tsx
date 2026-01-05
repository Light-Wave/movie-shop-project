"use client";

import { useActionState, useEffect, type ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { addItemAction } from "@/server-actions/cart/cartActions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import broadcastCartUpdate from "@/lib/broadcastCartUpdate";

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

  useEffect(() => {
    if (state?.success) {
      toast.success("Added to cart", {
        position: "bottom-right",
      });
      broadcastCartUpdate();
    }
  }, [state]);

  return (
    <form action={formAction} className="w-fit relative">
      <input type="hidden" name="movieId" value={props.movieId} />
      <SubmitButton {...props} />
    </form>
  );
}
