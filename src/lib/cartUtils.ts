import { CartItem } from "@/components/types/movie";

export function parseCart(cartCookie: string | undefined): CartItem[] {
  if (!cartCookie) return [];
  try {
    return JSON.parse(cartCookie) as CartItem[];
  } catch {
    return [];
  }
}

export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items);
}

export function addToCart(
  items: CartItem[],
  movieId: string,
  quantity: number = 1
): CartItem[] {
  const existing = items.find((i) => i.movieId === movieId);
  if (existing) {
    return items.map((i) =>
      i.movieId === movieId ? { ...i, quantity: i.quantity + quantity } : i
    );
  }
  return [...items, { movieId, quantity }];
}

export function removeCartItem(items: CartItem[], movieId: string): CartItem[] {
  return items.filter((item) => item.movieId !== movieId);
}

export function updateCartItem(
  items: CartItem[],
  movieId: string,
  quantity: number
): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(items, movieId);
  }
  return items.map((item) =>
    item.movieId === movieId ? { ...item, quantity } : item
  );
}

export function getCartTotalItems(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0);
}
