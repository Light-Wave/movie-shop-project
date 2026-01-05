"use server";

import { OrderStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export type SetOrderStatusResult = { success: boolean; error?: string };

async function setOrderStatus(
  orderId: string,
  status: string
): Promise<SetOrderStatusResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  // Add admin role check
  if (!session) {
    return {
      success: false,
      error: "Unauthorized: Must be logged in to edit orders.",
    };
  }
  if (!session.user || session.user.role !== "admin") {
    return {
      success: false,
      error: "Unauthorized: Must be an admin to edit orders.",
    };
  }
  if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
    return { success: false, error: "Invalid status" };
  }
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
  });
  return { success: true };
}
// Server action wrapper compatible with form actions and `useActionState`
export async function setOrderStatusAction(
  _prev: SetOrderStatusResult | undefined,
  formData: FormData
): Promise<SetOrderStatusResult> {
  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  if (!orderId) return { success: false, error: "Missing orderId" };
  if (!status) return { success: false, error: "Missing status" };

  const res = await setOrderStatus(orderId, status);
  if (res.success) {
    // Revalidate the order detail page so its SSR content updates
    revalidatePath(`/admin/manage-orders/${orderId}`);
  }
  return res;
}
