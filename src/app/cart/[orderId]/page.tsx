import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PriceDisplay from "@/components/prise-display";

export default async function OrderViewPage(
  props: PageProps<"/cart/[orderId]">
) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params["orderId"] },
    include: {
      items: { include: { movie: { select: { title: true } } } },
      deliveryAddress: true,
      billingAddress: true,
    },
  });
  if (!order) {
    notFound();
  }
  const sameAddress =
    order.billingAddress?.city === order.deliveryAddress?.city &&
    order.billingAddress?.street === order.deliveryAddress?.street &&
    order.billingAddress?.zipCode === order.deliveryAddress?.zipCode &&
    order.billingAddress?.country === order.deliveryAddress?.country &&
    order.billingAddress?.state === order.deliveryAddress?.state;
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Order Successful 🎉</h1>
      <p>Thank you for your purchase!</p>

      <p>Order ID: {order.id}</p>
      <p>
        Total: <PriceDisplay price={order.totalAmount} />
      </p>
      <p>Status: {order.status}</p>
      <p>Ordered on: {order.orderDate.toLocaleString()}</p>

      {/* Addresses */}
      {order.deliveryAddress && (
        <div className="mt-4 text-left max-w-xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
          <address className="not-italic text-sm">
            <div>{order.deliveryAddress.street}</div>
            <div>
              {order.deliveryAddress.city}
              {order.deliveryAddress.state
                ? `, ${order.deliveryAddress.state}`
                : ""}{" "}
              {order.deliveryAddress.zipCode}
            </div>
            <div>{order.deliveryAddress.country}</div>
          </address>

          {order.billingAddress && !sameAddress && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Billing Address</h2>
              <address className="not-italic text-sm">
                <div>{order.billingAddress.street}</div>
                <div>
                  {order.billingAddress.city}
                  {order.billingAddress.state
                    ? `, ${order.billingAddress.state}`
                    : ""}{" "}
                  {order.billingAddress.zipCode}
                </div>
                <div>{order.billingAddress.country}</div>
              </address>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-left max-w-xl mx-auto">
        <h2 className="text-lg font-semibold mb-2">Items</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div className="flex-1 text-left">
                <div className="font-medium">
                  {item.movie?.title ?? "Unknown"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quantity: {item.quantity}
                </div>
              </div>
              <div className="text-right">
                <div>
                  <PriceDisplay price={item.priceAtPurchase} />
                </div>
                <div className="text-sm text-muted-foreground">
                  {/* subtotal */}
                  <PriceDisplay price={item.priceAtPurchase * item.quantity} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button asChild>
        <Link href="/browse">Continue Shopping</Link>
      </Button>
    </div>
  );
}
