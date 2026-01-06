"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  addToWishlistAction,
  removeFromWishlistAction,
  checkWishlistAction,
} from "@/server-actions/wishlist/wishlistActions";

type Props = {
  movieId: string;
  className?: string;
  size?: "sm" | "lg" | "default" | "icon";
};

export default function AddToWishlistButton({ movieId, className, size = "icon" }: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    checkWishlistAction(movieId).then(setIsWishlisted);
  }, [movieId]);

  const handleToggleWishlist = async () => {
    setIsPending(true);
    try {
      if (isWishlisted) {
        const result = await removeFromWishlistAction(movieId);
        if (result.success) {
          setIsWishlisted(false);
          toast.success("Removed from wishlist", { position: "bottom-right" });
          window.dispatchEvent(new CustomEvent("wishlist:update", { detail: { movieId } }));
        } else {
          toast.error(result.message || "Failed to remove", { position: "bottom-right" });
        }
      } else {
        const result = await addToWishlistAction(movieId);
        if (result.success) {
          setIsWishlisted(true);
          toast.success("Added to wishlist", { position: "bottom-right" });
          window.dispatchEvent(new CustomEvent("wishlist:update", { detail: { movieId } }));
        } else {
          toast.error(result.message || "Failed to add", { position: "bottom-right" });
        }
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={handleToggleWishlist}
      disabled={isPending}
      className={className}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isWishlisted
            ? "fill-red-500 text-red-500"
            : "text-muted-foreground hover:text-red-500"
        }`}
      />
      <span className="sr-only">
        {isWishlisted ? "Remove from" : "Add to"} wishlist
      </span>
    </Button>
  );
}