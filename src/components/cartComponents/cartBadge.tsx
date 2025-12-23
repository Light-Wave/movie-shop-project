import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCart } from "@/server-actions/cart/cartActions";
import { getCartTotalItems } from "@/lib/cartUtils";


export default async function CartBadge() {
  const cart = await getCart();
   const total = getCartTotalItems(cart);

  return (
    <Button asChild variant="secondary">
      <Link href="/cart">Cart ({total})</Link>
    </Button>
  );
}
