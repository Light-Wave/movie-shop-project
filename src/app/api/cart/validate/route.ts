import { cookies } from "next/headers";
import { validateCartItems } from "@/lib/validate-cart";
import { COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/cartUtils";
import { serializeCart } from "@/lib/cartUtils";
import { NextResponse } from "next/server";

const SESSION_FLAG = "cart_validated";

export async function POST() {
  const store = await cookies();

  if (store.get(SESSION_FLAG)) {
    return NextResponse.json({ ok: true });
  }

  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) {
    store.set(SESSION_FLAG, "true", { path: "/" });
    return NextResponse.json({ ok: true });
  }

  let cart;
  try {
    cart = JSON.parse(raw);
  } catch (err) {
    // If the cookie is corrupt (invalid JSON), clear it and mark session validated
    // so we don't keep trying to parse it on every request.
    store.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    store.set(SESSION_FLAG, "true", { path: "/" });
    return NextResponse.json({ ok: true });
  }

  const result = await validateCartItems(cart);

  if (result.changed) {
    store.set(COOKIE_NAME, serializeCart(result.cart), COOKIE_OPTIONS);
  }

  store.set(SESSION_FLAG, "true", { path: "/" });

  return NextResponse.json({ ok: true });
}
