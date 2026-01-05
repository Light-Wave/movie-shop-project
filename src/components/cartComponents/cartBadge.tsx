"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCart } from "@/server-actions/cart/cartActions";
import { getCartTotalItems } from "@/lib/cartUtils";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function CartBadge() {
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const cart = await getCart();
      if (mounted) setTotal(getCartTotalItems(cart));
    }

    load();

    // Listen for cross-tab or in-page updates
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("movie_cart");
      bc.onmessage = () => load();
    } catch (err) {
      // fallback: listen for a custom window event
      const handler = () => load();
      window.addEventListener("movie_cart:updated", handler);
      return () => {
        mounted = false;
        window.removeEventListener("movie_cart:updated", handler);
      };
    }

    const handler = () => load();
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") load();
    });

    return () => {
      mounted = false;
      if (bc) {
        bc.close();
      }
    };
  }, []);

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative hover:bg-secondary rounded-full"
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {total > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {total}
          </span>
        )}
        <span className="sr-only">Cart ({total} items)</span>
      </Link>
    </Button>
  );
}
