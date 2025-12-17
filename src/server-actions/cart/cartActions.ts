"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseCart,
  serializeCart,
  addToCart,
  removeCartItem,
  updateCartItem,
} from "@/lib/cartUtils";
import type {
  CartItem,
  CartItemWithMovie,
  CartMovieView,
} from "@/components/types/movie";

import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "movie_cart";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/",
};

/** Save cart → cookie and revalidate relevant routes */
async function saveCart(items: CartItem[]) {
  const store = await cookies();
  store.set(COOKIE_NAME, serializeCart(items), COOKIE_OPTIONS);
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/cart/checkout");
}

/** Read cart from HTTP-only cookie */
export async function getCart(): Promise<CartItem[]> {
  console.log("🍪 getCart called");
  const store = await cookies();
  return parseCart(store.get(COOKIE_NAME)?.value);
}

/** Clear cart cookie and revalidate */
export async function clearCartAction() {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });

  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/cart/checkout");
}

/** Server action: add an item (increments if exists) */
export async function addItemAction(formData: FormData) {
  console.log("addItemAction fired");
  const movieId = formData.get("movieId") as string;
  console.log("✅ SERVER received movieId:", movieId);
  if (!movieId) return;

  const cart = await getCart();
  const updated = addToCart(cart, movieId, 1);
  await saveCart(updated);
}

/** Server action: remove an item */
export async function removeItemAction(formData: FormData) {
  const movieId = formData.get("movieId") as string;
  if (!movieId) return;

  const cart = await getCart();
  const updated = removeCartItem(cart, movieId);
  await saveCart(updated);
}

/** Server action: update quantity (<=0 removes) */
export async function updateQuantityAction(formData: FormData) {
  const movieId = formData.get("movieId") as string;
  const quantity = Number(formData.get("quantity"));
  if (!movieId || Number.isNaN(quantity)) return;

  const cart = await getCart();
  const updated = updateCartItem(cart, movieId, quantity);
  await saveCart(updated);
}

/**
 Merge cookie cart with Movie data from Prisma.
 */
export async function getCartWithMovies(): Promise<CartItemWithMovie[]> {
  const items = await getCart();
  if (items.length === 0) return [];

  const ids = items.map((i) => i.movieId);

  const movies = await prisma.movie.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      title: true,
      price: true,
      imageUrl: true,
      isAvailable: true,
      stock: true,
    },
  });

  const byId = new Map<string, CartMovieView>(
    movies.map((m) => [
      m.id,
      {
        id: m.id,
        title: m.title,
        priceCents: m.price,
        imageUrl: m.imageUrl ?? undefined,
        isAvailable: m.isAvailable,
        stock: m.stock,
      },
    ])
  );

  return items
    .map((i) => {
      const movie = byId.get(i.movieId);
      if (!movie) return null; // stale/deleted id
      return { ...i, movie };
    })
    .filter(Boolean) as CartItemWithMovie[];
}

/**
 * Checkout action:
 * - Validates availability and stock.
 * - (Optional) Create Order + OrderItem rows and decrement stock.
 * - Clears cart and redirects to success page.
 */
export async function checkoutAction() {
  const items = await getCartWithMovies();
  if (items.length === 0) {
    redirect("/cart");
  }

  // Validate
  for (const it of items) {
    if (!it.movie.isAvailable) {
      throw new Error(`"${it.movie.title}" is unavailable.`);
    }
    if (it.quantity > it.movie.stock) {
      throw new Error(
        `"${it.movie.title}" exceeds stock (requested ${it.quantity}, available ${it.movie.stock}).`
      );
    }
  }

  // Compute totals in cents
  const subtotalCents = items.reduce(
    (sum, it) => sum + it.movie.priceCents * it.quantity,
    0
  );

  // ToDO: Persist order (uncomment and plug userId when auth is ready)
  // const userId = /* your auth session user id */;
  // const order = await prisma.order.create({
  //   data: {
  //     userId,
  //     totalAmount: (subtotalCents / 100).toFixed(2), // Decimal string
  //     status: "PROCESSING",
  //     items: {
  //       create: items.map((it) => ({
  //         movieId: it.movie.id,
  //         quantity: it.quantity,
  //         priceAtPurchase: (it.movie.priceCents / 100).toFixed(2),
  //       })),
  //     },
  //   },
  // });

  // TODO: decrement stock in a transaction
  // await prisma.$transaction(
  //   items.map((it) =>
  //     prisma.movie.update({
  //       where: { id: it.movie.id },
  //       data: { stock: { decrement: it.quantity } },
  //     })
  //   )
  // );

  // Clear cart & success
  await clearCartAction();
  redirect("/cart/success");
}
``;
