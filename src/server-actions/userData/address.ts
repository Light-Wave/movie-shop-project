"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { addressSchema } from "@/zod/address";

type Result = { success: true } | { success: false; error: string };

export async function updateAddress(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, error: "User is not logged in" };
  }
  const rawData = Object.fromEntries(formData.entries());
  const parsed = addressSchema.safeParse(rawData);

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

  // Fetch existing userData and current addresses
  const existingUserData = await prisma.userData.findUnique({
    where: { userId: session.user.id },
    include: { deliveryAddress: true, billingAddress: true },
  });

  if (!existingUserData) {
    // Create userData with nested addresses
    await prisma.userData.create({
      data: {
        user: { connect: { id: session.user.id } },
        deliveryAddress: {
          create: deliveryAddressPayload,
        },
        billingAddress: { create: billingAddressPayload },
      },
    });
    return { success: true } as Result;
  }

  // Update existing userData: upsert delivery and billing as needed
  await prisma.userData.update({
    where: { userId: session.user.id },
    data: {
      deliveryAddress: existingUserData.deliveryAddress
        ? { update: deliveryAddressPayload }
        : { create: deliveryAddressPayload },
      billingAddress: existingUserData.billingAddress
        ? { update: billingAddressPayload }
        : { create: billingAddressPayload },
    },
  });

  return { success: true } as Result;
}
