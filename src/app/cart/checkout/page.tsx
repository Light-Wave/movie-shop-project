import { getCartWithMovies } from "@/server-actions/cart/cartActions";
import { Button } from "@/components/ui/button";
import PriceDisplay from "@/components/prise-display";
import CheckoutForm from "./checkoutForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function CheckoutPage() {
  const items = await getCartWithMovies();

  if (items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const total = items.reduce(
    (sum, i) => sum + i.movie.priceCents * i.quantity,
    0
  );
  const session = await auth.api.getSession({ headers: await headers() });
  let addresses;
  if (session !== null) {
    addresses = await prisma.userData.findUnique({
      where: {
        userId: session?.user.id,
      },
      select: { billingAddress: true, deliveryAddress: true },
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.movie.id} className="flex justify-between">
            <span>
              {i.movie.title} × {i.quantity}
            </span>
            <span>
              <PriceDisplay price={i.movie.priceCents * i.quantity} />
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 flex justify-between font-semibold">
        <span>Total</span>
        <span>
          <PriceDisplay price={total} />
        </span>
      </div>

      <CheckoutForm
        billingAddress={addresses?.billingAddress}
        deliveryAddress={addresses?.deliveryAddress}
        email={session?.user.email ?? undefined}
      />
    </div>
  );
}
