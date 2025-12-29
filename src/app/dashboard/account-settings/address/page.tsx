import ChangeAddressForm from "@/components/dashboard/changeAddressForm";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export default async function ChangeAddress() {
  const session = await auth.api.getSession({ headers: await headers() });
  const addresses = await prisma.userData.findUnique({
    where: {
      userId: session?.user.id,
    },
    select: { billingAddress: true, deliveryAddress: true },
  });
  if (session == null) {
    throw new Error("User is not authenticated");
  }
  return (
    <ChangeAddressForm
      billingAddress={addresses?.billingAddress}
      deliveryAddress={addresses?.deliveryAddress}
    />
  );
}
