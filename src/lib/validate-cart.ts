import { CartItem } from "@/components/types/movie";
import { prisma } from "./prisma";

export async function validateCartItems(cart: CartItem[]) {
  if (cart.length === 0) return { changed: false, cart };

  const ids = cart.map((i) => i.movieId);

  const movies = await prisma.movie.findMany({
    where: { id: { in: ids } },
    select: { id: true },
  });

  if (movies.length === ids.length) {
    return { changed: false, cart };
  }

  const validIds = new Set(movies.map((m) => m.id));
  const newCart = cart.filter((item) => validIds.has(item.movieId));

  return {
    changed: true,
    cart: newCart,
  };
}
