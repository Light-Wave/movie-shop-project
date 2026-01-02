import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavClient } from "@/components/layout/nav-client";
import CartBadge from "@/components/cartComponents/cartBadge";

export async function Nav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <NavClient
      initialSession={session}
      cartBadge={<CartBadge />}
    />
  );
}
