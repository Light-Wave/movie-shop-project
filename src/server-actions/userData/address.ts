"use server";

import { Address } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

type Result = { success: true } | { success: false; error: string };

/**
 * Params
 * - billingAddress: undefined => after operation, billing links to delivery
 *                   null => delete billing address
 *                   object => create or connect/overwrite billing address
 * - deliveryAddress: undefined => leave delivery as-is
 *                     null => delete delivery address
 *                     object => create or connect/overwrite delivery address
 */
type AddressInput = (Partial<Address> & { id?: string }) | null;

type Params = {
  billingAddress?: AddressInput; // undefined => link to delivery, null => delete
  deliveryAddress?: AddressInput; // undefined => leave unchanged, null => delete
};
export async function updateAddress(params: Params): Promise<Result> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return { success: false, error: "User is not authenticated" };
  }

  // Fetch existing userData and current addresses
  const existing = await prisma.userData.findUnique({
    where: { userId: session.user.id },
    include: { deliveryAddress: true, billingAddress: true },
  });

  // Run all address and userData changes inside a transaction to keep things consistent
  await prisma.$transaction(async (prismaTx) => {
    if (!existing) {
      // Create path
      let deliveryId: string | null = null;
      if (params.deliveryAddress === null) {
        deliveryId = null; // user explicitly wants no delivery address
      } else if (params.deliveryAddress?.id) {
        deliveryId = params.deliveryAddress.id;
        // if other fields provided, update that address
        const { id, ...rest } = params.deliveryAddress;
        if (Object.keys(rest).length > 0) {
          await prismaTx.address
            .update({ where: { id: deliveryId }, data: rest as any })
            .catch(() => {});
        }
      } else if (params.deliveryAddress) {
        const created = await prismaTx.address.create({
          data: params.deliveryAddress as any,
        });
        deliveryId = created.id;
      }

      let billingId: string | null = null;
      if (params.billingAddress === null) {
        billingId = null;
      } else if (params.billingAddress?.id) {
        billingId = params.billingAddress.id;
        const { id, ...rest } = params.billingAddress;
        if (Object.keys(rest).length > 0) {
          await prismaTx.address
            .update({ where: { id: billingId }, data: rest as any })
            .catch(() => {});
        }
      } else if (params.billingAddress) {
        const created = await prismaTx.address.create({
          data: params.billingAddress as any,
        });
        billingId = created.id;
      } else {
        // billing not provided -> link to delivery
        billingId = deliveryId;
      }

      await prismaTx.userData.create({
        data: {
          userId: session.user.id,
          deliveryAddressId: deliveryId ?? undefined,
          billingAddressId: billingId ?? undefined,
        },
      });

      return;
    }

    // Update path for existing userData
    let newDeliveryId = existing.deliveryAddressId ?? null;
    let newBillingId = existing.billingAddressId ?? null;

    // Handle deliveryAddress param
    if (params.deliveryAddress === null) {
      // delete delivery address if present
      if (existing.deliveryAddressId) {
        // if billing was pointing to same address and billing param is undefined, we will also clear billing
        const wasShared =
          existing.deliveryAddressId === existing.billingAddressId;
        await prismaTx.address
          .delete({ where: { id: existing.deliveryAddressId } })
          .catch(() => {});
        newDeliveryId = null;
        if (wasShared && params.billingAddress === undefined) {
          newBillingId = null;
        }
      }
    } else if (params.deliveryAddress) {
      // provided delivery data -> prefer to create a new address or connect
      if (params.deliveryAddress.id) {
        // connect or update existing address id
        newDeliveryId = params.deliveryAddress.id;
        const { id, ...rest } = params.deliveryAddress;
        if (Object.keys(rest).length > 0) {
          await prismaTx.address
            .update({ where: { id: newDeliveryId }, data: rest as any })
            .catch(() => {});
        }
        // if delivery used to be a different address that is no longer referenced, delete it
        if (
          existing.deliveryAddressId &&
          existing.deliveryAddressId !== newDeliveryId &&
          existing.deliveryAddressId !== existing.billingAddressId
        ) {
          await prismaTx.address
            .delete({ where: { id: existing.deliveryAddressId } })
            .catch(() => {});
        }
      } else {
        // create a fresh delivery address
        const created = await prismaTx.address.create({
          data: params.deliveryAddress as any,
        });
        newDeliveryId = created.id;

        // If previous delivery existed and was not shared with billing, delete it
        if (
          existing.deliveryAddressId &&
          existing.deliveryAddressId !== existing.billingAddressId
        ) {
          await prismaTx.address
            .delete({ where: { id: existing.deliveryAddressId } })
            .catch(() => {});
        }

        // If previous delivery was shared with billing and billing not provided, move billing to point to the new delivery
        if (
          existing.deliveryAddressId &&
          existing.deliveryAddressId === existing.billingAddressId &&
          params.billingAddress === undefined
        ) {
          newBillingId = created.id;
          await prismaTx.address
            .delete({ where: { id: existing.deliveryAddressId } })
            .catch(() => {});
        }
      }
    }

    // Handle billingAddress param
    if (params.billingAddress === null) {
      // delete billing address if present
      if (existing.billingAddressId) {
        // if billing points to the same address as delivery, don't delete the shared address (that would remove delivery); just disconnect
        if (existing.billingAddressId === newDeliveryId) {
          newBillingId = null;
        } else {
          await prismaTx.address
            .delete({ where: { id: existing.billingAddressId } })
            .catch(() => {});
          newBillingId = null;
        }
      }
    } else if (params.billingAddress) {
      if (params.billingAddress.id) {
        newBillingId = params.billingAddress.id;
        const { id, ...rest } = params.billingAddress;
        if (Object.keys(rest).length > 0) {
          await prismaTx.address
            .update({ where: { id: newBillingId }, data: rest as any })
            .catch(() => {});
        }
        if (
          existing.billingAddressId &&
          existing.billingAddressId !== newBillingId &&
          existing.billingAddressId !== existing.deliveryAddressId
        ) {
          await prismaTx.address
            .delete({ where: { id: existing.billingAddressId } })
            .catch(() => {});
        }
      } else {
        const created = await prismaTx.address.create({
          data: params.billingAddress as any,
        });
        // if billing used to be different and not shared with delivery, delete old
        if (
          existing.billingAddressId &&
          existing.billingAddressId !== existing.deliveryAddressId
        ) {
          await prismaTx.address
            .delete({ where: { id: existing.billingAddressId } })
            .catch(() => {});
        }
        newBillingId = created.id;
      }
    } else if (params.billingAddress === undefined) {
      // not provided => billing should reference delivery
      newBillingId = newDeliveryId;
      // delete the old billing if it was different and not the delivery
      if (
        existing.billingAddressId &&
        existing.billingAddressId !== newBillingId &&
        existing.billingAddressId !== existing.deliveryAddressId
      ) {
        await prismaTx.address
          .delete({ where: { id: existing.billingAddressId } })
          .catch(() => {});
      }
    }

    // Apply final userData update
    await prismaTx.userData.update({
      where: { userId: session.user.id },
      data: {
        deliveryAddressId: newDeliveryId ?? null,
        billingAddressId: newBillingId ?? null,
      },
    });
  });

  return { success: true };
}
