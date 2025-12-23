import Link from "next/link";
import { getCartWithMovies } from "@/server-actions/cart/cartActions";
import { CartItem } from "@/components/cartComponents/cartItem";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/prise-display";

export default async function CartPage() {
  const items = await getCartWithMovies();

  if (items.length === 0) {
    return <p className="text-center">Your cart is empty.</p>;
  }

  const total = items.reduce(
    (sum, i) => sum + i.movie.priceCents * i.quantity,
    0
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>

      {items.map((item) => (
        <CartItem key={item.movie.id} item={item} />
      ))}

      <div className="flex justify-between items-center border-t pt-4">
        <p className="text-lg font-semibold">
          Total: <PriceDisplay price={total} />
        </p>

        <Button asChild>
          <Link href="/cart/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
