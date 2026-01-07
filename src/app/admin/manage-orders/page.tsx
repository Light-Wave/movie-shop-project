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

export default async function ManageOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <Table>
        <TableCaption>A list of all orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Link href={`/admin/manage-orders/${order.id}`}>
                  {order.id.substring(0, 10)}...
                </Link>
              </TableCell>
              <TableCell>
                {order.user?.name ??
                  order.user?.email ??
                  order.email ??
                  "Unknown"}
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
