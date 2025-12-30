import { cookies } from "next/headers";
import { validateCartItems } from "@/lib/validate-cart";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/cartUtils";
import { serializeCart } from "@/lib/cartUtils";

const SESSION_FLAG = "cart_validated";

export async function POST() {
  const store = await cookies();

  if (store.get(SESSION_FLAG)) {
    return Response.json({ ok: true });
  }

  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) {
    store.set(SESSION_FLAG, "true", { path: "/" });
    return Response.json({ ok: true });
  }

  const cart = JSON.parse(raw);
  const result = await validateCartItems(cart);

  if (result.changed) {
    store.set(COOKIE_NAME, serializeCart(result.cart), COOKIE_OPTIONS);
  }

  store.set(SESSION_FLAG, "true", { path: "/" });

  return Response.json({ ok: true });
}
