import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavClient } from "@/components/layout/nav-client";
import CartBadge from "@/components/cartComponents/cartBadge";
import { CartValidationBootstrap } from "@/components/cartComponents/cartValidator";

export async function Nav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sessionUser = session
    ? {
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          // role is not part of the model yet, so accepts "any" for now, should work even after role is set, but ideally should be typed correctly
          role: (session.user as any).role,
        },
      }
    : null;

  return <NavClient initialSession={sessionUser} cartBadge={<CartBadge />} />;
}
