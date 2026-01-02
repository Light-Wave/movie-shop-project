import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavClient } from "@/components/layout/nav-client";
import CartBadge from "@/components/cartComponents/cartBadge";
import { CartValidationBootstrap } from "@/components/cartComponents/cartValidator";

export async function Nav() {
  return (
    <>
      <NavClient cartBadge={<CartBadge />} />
      <CartValidationBootstrap />
    </>
  );
}
