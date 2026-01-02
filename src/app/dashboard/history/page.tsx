import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PriceDisplay from "@/components/prise-display";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const orders = await prisma.order.findMany({
    where: { userId: session?.user.id },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      <Table>
        <TableCaption>A list of all orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              className="relative hover:bg-muted/50 cursor-pointer"
            >
              <TableCell>
                <Link
                  href={`/cart/${order.id}`}
                  className="absolute inset-0 z-10"
                  aria-label={`View order ${order.id}`}
                />
                {order.id.substring(0, 10)}...
              </TableCell>
              <TableCell>
                <PriceDisplay price={order.totalAmount} />
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.orderDate.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
