import { prisma } from "@/lib/prisma";
import PriceDisplay from "@/components/prise-display";
import { OrderStatus } from "@/generated/prisma/enums";
import OrderStatusEditor from "@/components/admin/order-status-editor";

export default async function ManageOrderDetailPage(
  props: PageProps<"/admin/manage-orders/[order-id]">
) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: params["order-id"] },
    include: {
      user: true,
      deliveryAddress: true,
      billingAddress: true,
      items: {
        include: {
          movie: true,
        },
      },
    },
  });
  if (!order) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Order Not Found</h1>
        <p>The order you are looking for does not exist.</p>
      </div>
    );
  }
  const sameAddress =
    order.billingAddress.city === order.deliveryAddress.city &&
    order.billingAddress.street === order.deliveryAddress.street &&
    order.billingAddress.zipCode === order.deliveryAddress.zipCode &&
    order.billingAddress.country === order.deliveryAddress.country &&
    order.billingAddress.state === order.deliveryAddress.state;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Order:</h1>
      <p>
        Total: <PriceDisplay price={order.totalAmount} />
      </p>
      <div className="flex items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="font-medium">{order.status}</p>
        </div>
        <div>
          <OrderStatusEditor
            orderId={order.id}
            currentStatus={order.status}
            statuses={Object.values(OrderStatus)}
          />
        </div>
      </div>
      <p>Ordered on: {order.orderDate.toLocaleString()}</p>
      <p>
        Customer: {order.user?.name} - {order.user?.email}
      </p>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Delivery Address</h2>
        <p>{order.deliveryAddress.street}</p>
        <p>
          {order.deliveryAddress.city}
          {order.deliveryAddress.state
            ? `, ${order.deliveryAddress.state}`
            : ""}{" "}
          {order.deliveryAddress.zipCode}
        </p>
        <p>{order.deliveryAddress.country}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Billing Address</h2>
        {sameAddress ? (
          <p>Same as delivery address</p>
        ) : (
          <>
            <p>{order.billingAddress.street}</p>
            <p>
              {order.billingAddress.city}
              {order.billingAddress.state
                ? `, ${order.billingAddress.state}`
                : ""}{" "}
              {order.billingAddress.zipCode}
            </p>
            <p>{order.billingAddress.country}</p>
          </>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Items</h2>
        <ul className="list-disc pl-6">
          {order.items.map((item) => (
            <li key={item.id}>
              {item.movie?.title ?? "Unknown movie"} — Qty: {item.quantity} —{" "}
              <PriceDisplay price={item.priceAtPurchase} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
