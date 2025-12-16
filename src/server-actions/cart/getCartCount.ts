"use server";

import { cookies } from "next/headers";
import { parseCart } from "@/lib/cartUtils";

export async function getCartCount() {
  const store = await cookies();
  const cart = parseCart(store.get("movie_cart")?.value);
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
