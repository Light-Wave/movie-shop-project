import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditArtistPage(
  props: PageProps<"/cart/[orderId]">
) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params["orderId"] },
  });
  if (!order) {
    notFound();
  }
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Order Successful 🎉</h1>
      <p>Thank you for your purchase!</p>

      <p>Order ID: {order.id}</p>
      <p>Total: {order.totalAmount}</p>
      <p>Status: {order.status}</p>
      <p>Ordered on: {order.orderDate.toLocaleString()}</p>
      <Button asChild>
        <Link href="/browse">Continue Shopping</Link>
      </Button>
    </div>
  );
}
