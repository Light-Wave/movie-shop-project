"use client";

import { useFormStatus } from "react-dom";
import type { CartItemWithMovie } from "@/components/types/movie";
import {
  updateQuantityAction,
  removeItemAction,
} from "@/server-actions/cart/cartActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import broadcastCartUpdate from "@/lib/broadcastCartUpdate";

function SubmitButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="icon"
      variant="outline"
      disabled={pending || disabled}
    >
      {children}
    </Button>
  );
}

export function CartItem({ item }: { item: CartItemWithMovie }) {
  const { movie, quantity } = item;

  const [, updateAction] = useActionState(updateQuantityAction, {
    success: true,
  });

  const [, removeAction] = useActionState(removeItemAction, {
    success: true,
  });

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex-1">
          <h3 className="font-semibold">{movie.title}</h3>

          {!movie.isAvailable && (
            <p className="text-sm text-red-600">Unavailable</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Quantity */}
          <div className="flex items-center gap-2">
            <form action={updateAction} onSubmit={broadcastCartUpdate}>
              <input type="hidden" name="movieId" value={movie.id} />
              <input type="hidden" name="quantity" value={quantity - 1} />
              <SubmitButton disabled={quantity <= 1}>−</SubmitButton>
            </form>

            <span className="w-6 text-center">{quantity}</span>

            <form action={updateAction} onSubmit={broadcastCartUpdate}>
              <input type="hidden" name="movieId" value={movie.id} />
              <input type="hidden" name="quantity" value={quantity + 1} />
              <SubmitButton>+</SubmitButton>
            </form>
          </div>

          {/* Remove */}
          <form action={removeAction} onSubmit={broadcastCartUpdate}>
            <input type="hidden" name="movieId" value={movie.id} />
            <Button type="submit" variant="destructive" size="sm">
              Remove
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
