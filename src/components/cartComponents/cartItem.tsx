import type { CartItemWithMovie } from "@/components/types/movie";
import {
  updateQuantityAction,
  removeItemAction,
} from "@/server-actions/cart/cartActions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatSEK(cents: number) {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(cents / 100);
}

export function CartItem({ item }: { item: CartItemWithMovie }) {
  const { movie, quantity } = item;
  const lineTotal = movie.priceCents * quantity;

  return (
    <Card>
      <CardContent className="flex items-center justify-between py-4">
        {/* LEFT */}
        <div className="flex-1">
          <h3 className="font-semibold">{movie.title}</h3>
          <p className="text-sm text-muted-foreground">
            {formatSEK(movie.priceCents)} each
          </p>

          {!movie.isAvailable && (
            <p className="mt-1 text-sm text-red-600">Unavailable</p>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <form action={updateQuantityAction}>
              <input type="hidden" name="movieId" value={movie.id} />
              <input type="hidden" name="quantity" value={quantity - 1} />
              <Button
                type="submit"
                size="icon"
                variant="outline"
                disabled={quantity <= 1}
              >
            
              </Button>
            </form>

            <span className="w-8 text-center">{quantity}</span>

            <form action={updateQuantityAction}>
              <input type="hidden" name="movieId" value={movie.id} />
              <input type="hidden" name="quantity" value={quantity + 1} />
              <Button type="submit" size="icon" variant="outline">
                +
              </Button>
            </form>
          </div>

          {/* Line total */}
          <p className="font-semibold w-24 text-right">
            {formatSEK(lineTotal)}
          </p>

          {/* Remove */}
          <form action={removeItemAction}>
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
