"use server";

import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type WishlistActionState = {
  success: boolean;
  message?: string;
  isWishlisted?: boolean;
};

/** Add movie to wishlist */
export async function addToWishlistAction(
  movieId: string
): Promise<WishlistActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Please log in to add to wishlist" };
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        movieId,
      },
    });

    revalidatePath("/dashboard/wishlist");
    revalidatePath("/browse");
    revalidatePath(`/browse/${movieId}`);

    return { success: true, isWishlisted: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      // Already in wishlist
      return {
        success: true,
        isWishlisted: true,
        message: "Already in wishlist",
      };
    }
    return { success: false, message: "Failed to add to wishlist" };
  }
}

/** Remove movie from wishlist */
export async function removeFromWishlistAction(
  movieId: string
): Promise<WishlistActionState> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return { success: false, message: "Please log in" };
    }

    await prisma.wishlist.delete({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId,
        },
      },
    });

    revalidatePath("/dashboard/wishlist");
    revalidatePath("/browse");
    revalidatePath(`/browse/${movieId}`);

    return { success: true, isWishlisted: false };
  } catch {
    return { success: false, message: "Failed to remove from wishlist" };
  }
}

/** Check if movie is in wishlist */
export async function checkWishlistAction(movieId: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return false;

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId,
        },
      },
    });

    return !!wishlist;
  } catch {
    return false;
  }
}

/** Get user's wishlist */
export async function getWishlistAction() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) return [];

    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        movie: {
          select: {
            id: true,
            title: true,
            price: true,
            imageUrl: true,
            isAvailable: true,
            stock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return wishlists;
  } catch {
    return [];
  }
}
