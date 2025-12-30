"use client";
import { useEffect } from "react";

export function CartValidationBootstrap() {
  useEffect(() => {
    fetch("/api/cart/validate", { method: "POST" });
  }, []);

  return null;
}
