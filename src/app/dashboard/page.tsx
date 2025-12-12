//  View order history
//  Manage account information (optional)

import { Button } from "@/components/ui/button";
import Link from "next/link";

// Optinal Add buttons to share movie links on social media platforms
export default function Dashboard() {
  return (
    <div>
      <Button variant="link" asChild>
        <Link href="/dashboard/account-settings">Account Settings</Link>
      </Button>
      <Button variant="link" asChild>
        <Link href="/dashboard/history">Order History</Link>
      </Button>
      <Button variant="link" asChild>
        <Link href="/dashboard/wishlist">Wishlist</Link>
      </Button>
    </div>
  );
}
