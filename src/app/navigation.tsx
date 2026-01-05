import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavClient } from "@/components/layout/nav-client";
import { CartValidationBootstrap } from "@/components/cartComponents/cartValidator";

export async function Nav() {
  return (
    <>
      <NavClient />
      <CartValidationBootstrap />
    </>
  );
}
