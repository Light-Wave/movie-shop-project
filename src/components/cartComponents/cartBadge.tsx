import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCart } from "@/server-actions/cart/cartActions";
import { getCartTotalItems } from "@/lib/cartUtils";
import { ShoppingCart } from "lucide-react";

export default async function CartBadge() {
  const cart = await getCart();
  const total = getCartTotalItems(cart);

  return (
    <Button asChild variant="ghost" size="icon" className="relative hover:bg-secondary rounded-full">
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {total}
          </span>
        )}
        <span className="sr-only">Cart ({total} items)</span>
      </Link>
    </Button>
  );
}
