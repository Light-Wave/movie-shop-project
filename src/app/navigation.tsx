import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { NavClient } from "@/components/layout/nav-client";
import { CartValidationBootstrap } from "@/components/cartComponents/cartValidator";
import React from "react";

export async function Nav() {
  return (
    <>
      <React.Suspense fallback={<div />}>
        <NavClient />
      </React.Suspense>
      <React.Suspense fallback={<div />}>
        <CartValidationBootstrap />
      </React.Suspense>
    </>
  );
}
