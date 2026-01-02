export default async function ManageOrderDetailPage({
  params,
}: {
  params: { "order-id": string };
}) {
  const orderId = params["order-id"];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Manage Order: {orderId}</h1>
      <p>Order details will be displayed here.</p>
    </div>
  );
}
