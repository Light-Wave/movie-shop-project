"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseCart,
  serializeCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  getCartTotalItems,
  COOKIE_NAME,
  COOKIE_OPTIONS,
} from "@/lib/cartUtils";
import type {
  CartItem,
  CartItemWithMovie,
  CartMovieView,
} from "@/components/types/movie";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkoutSchema, CheckoutSchemaValues } from "@/zod/checkout";

export type CartActionState = {
  success: boolean;
  message?: string;
  cartCount?: number;
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
export async function addItemAction(
  _prev: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const movieId = formData.get("movieId") as string;
  if (!movieId) {
    return { success: false, message: "Invalid movie" };
  }

  const cart = await getCart();
  const updated = addToCart(cart, movieId, 1);
  saveCart(updated);

  return {
    success: true,
    cartCount: getCartTotalItems(updated),
  };
}

/** Server action: remove an item */
export async function removeItemAction(
  _prev: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const movieId = formData.get("movieId") as string;
  if (!movieId) {
    return { success: false };
  }

  const cart = await getCart();
  const updated = removeCartItem(cart, movieId);
  saveCart(updated);

  return {
    success: true,
    cartCount: getCartTotalItems(updated),
  };
}

/** Server action: update quantity (<=0 removes) */
export async function updateQuantityAction(
  _prev: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const movieId = formData.get("movieId") as string;
  const quantity = Number(formData.get("quantity"));

  if (!movieId || Number.isNaN(quantity)) {
    return { success: false, message: "Invalid quantity" };
  }

  const cart = await getCart();
  const updated = updateCartItem(cart, movieId, quantity);
  saveCart(updated);

  return {
    success: true,
    cartCount: getCartTotalItems(updated),
  };
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
export type CheckoutResult =
  | { success: true; redirect?: string }
  | { error: string | { field: string; message: string }[] };

export async function checkoutAction(
  formData: CheckoutSchemaValues
): Promise<CheckoutResult> {
  const items = await getCartWithMovies();
  if (items.length === 0) {
    return { success: true, redirect: "/cart" };
  }

  // Validate
  for (const it of items) {
    if (isNaN(it.quantity)) {
      return { error: `"${it.movie.title}" request count is NaN` };
    }
    if (!it.movie.isAvailable) {
      return { error: `"${it.movie.title}" is unavailable.` };
    }
    if (it.quantity > it.movie.stock) {
      return {
        error: `"${it.movie.title}" exceeds stock (requested ${it.quantity}, available ${it.movie.stock}).`,
      };
    }
  }

  // Compute totals in cents
  const total = items.reduce(
    (sum, it) => sum + it.movie.priceCents * it.quantity,
    0
  );

  // ToDO: Persist order (uncomment and plug userId when auth is ready)
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const parsed = checkoutSchema.safeParse(formData);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return { error: errors };
  }

  const data = parsed.data;

  // Build clean payloads for Prisma from prefixed form fields
  const deliveryAddressPayload = {
    street: data.delivery_street,
    city: data.delivery_city,
    state: data.delivery_state ?? null,
    zipCode: data.delivery_zipCode,
    country: data.delivery_country,
  };

  // If useSeparateBilling is false, copy billing from delivery. Otherwise, read billing fields.
  let billingAddressPayload: typeof deliveryAddressPayload;
  if (data.useSeparateBilling) {
    billingAddressPayload = {
      // Use nullish coalescing to satisfy TypeScript, though Zod ensures presence
      street: data.billing_street ?? "",
      city: data.billing_city ?? "",
      state: data.billing_state ?? null,
      zipCode: data.billing_zipCode ?? "",
      country: data.billing_country ?? "",
    };
  } else {
    billingAddressPayload = { ...deliveryAddressPayload };
  }

  const order = await prisma.order.create({
    data: {
      user: { connect: { id: userId } },
      totalAmount: total,
      status: "PROCESSING",
      items: {
        create: items.map((it) => ({
          movieId: it.movie.id,
          quantity: it.quantity,
          priceAtPurchase: it.movie.priceCents,
        })),
      },

      deliveryAddress: {
        create: deliveryAddressPayload,
      },
      billingAddress: { create: billingAddressPayload },
      email: data.email,
    },
  });

  // TODO: decrement stock in a transaction
  await prisma.$transaction(
    items.map((it) =>
      prisma.movie.update({
        where: { id: it.movie.id },
        data: { stock: { decrement: it.quantity } },
      })
    )
  );

  // Clear cart & success
  await clearCartAction();
  return { success: true, redirect: `/cart/${order.id}` };
}

export async function validateCart() {
  const cart = await getCart();
  if (cart.length === 0) return;

  const ids = cart.map((i) => i.movieId);

  const movies = await prisma.movie.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
    },
  });
  if (movies.length === ids.length) return; // All good

  // Some movies are no longer valid, remove them from cart
  const validIds = new Set(movies.map((m) => m.id));
  const newCart = cart.filter((item) => validIds.has(item.movieId));
  console.log("Cart validation removed items, new cart:", newCart);
  saveCart(newCart);
}
