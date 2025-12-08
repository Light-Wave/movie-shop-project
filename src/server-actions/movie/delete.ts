"use server";
//Delete movies

// Utilize Better Auth for user-related actions (registration, login, profile updates)

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type DeleteResult = { success: true } | { success: false; error: string };

export async function deleteMovieAction(
  formData: FormData
): Promise<DeleteResult> {
  try {
    // Auth: ensure caller is admin
    const headers = await import("next/headers").then((m) => m.headers());
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return { success: false, error: "Unauthorized: admin required" };
    }

    const user = (session as unknown as { user?: { role?: string } })?.user;
    if (!user || user.role !== "admin") {
      return { success: false, error: "Unauthorized: admin required" };
    }

    const movieId = formData.get("movieId")?.toString();
    if (!movieId) return { success: false, error: "Missing movieId" };

    // Prevent deleting movies that have order history (onDelete: Restrict)
    const orderCount = await prisma.orderItem.count({ where: { movieId } });
    if (orderCount > 0) {
      return {
        success: false,
        error: `Cannot delete movie with ${orderCount} order(s). Consider marking it unavailable instead.`,
      };
    }

    await prisma.movie.delete({ where: { id: movieId } });

    // Revalidate relevant pages
    try {
      revalidatePath("/admin/manage-products");
      revalidatePath("/browse");
    } catch (e) {
      console.warn("Revalidation failed:", e);
    }

    return { success: true };
  } catch (err) {
    console.error("deleteMovieAction error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
