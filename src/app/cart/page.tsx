import Link from "next/link";

export default function CartPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <p>Cart items will be displayed here.</p>
      <Link href="/cart/checkout" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded">
        Proceed to Checkout
      </Link>
    </div>
  );
}