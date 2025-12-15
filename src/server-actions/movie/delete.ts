"use server";
//Delete movies
// Utilize Better Auth for user-related actions (registration, login, profile updates)
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type DeleteResult = { success: true } | { success: false; error: string };

export async function deleteMovieAction(
  formData: FormData
): Promise<DeleteResult> {
  try {
    //Auth: ensure caller is admin
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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
      // Soft-disable: mark as unavailable and set deletedAt
      await prisma.movie.update({
        where: { id: movieId },
        data: { isAvailable: false, deletedAt: new Date() }, // deletedAt optional..
      });

      return {
        success: true,
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
