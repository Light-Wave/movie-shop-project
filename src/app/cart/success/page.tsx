import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-3xl font-bold mb-6">Thank you for your order!</h1>
      <p>Your order has been placed successfully.</p>
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Continue Shopping
        </Link>
        <span className="mx-4">|</span>
        <Link href="/dashboard/history" className="text-blue-500 hover:underline">
          View Order History
        </Link>
      </div>
    </div>
  );
}