import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Order Successful 🎉</h1>
      <p>Thank you for your purchase!</p>

      <Button asChild>
        <Link href="/browse">Continue Shopping</Link>
      </Button>
    </div>
  );
}
