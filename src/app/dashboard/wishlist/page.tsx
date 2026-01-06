"use client";

import { useEffect, useState } from "react";
import { getWishlistAction } from "@/server-actions/wishlist/wishlistActions";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import AddToWishlistButton from "@/components/whishlistComponents/addToWishlistButton";
import AddToCartButton from "@/components/cartComponents/addToCartButton";
import PriceDisplay from "@/components/prise-display";

const placeholder = "/placeholders/placeholder.jpg";

export default function Wishlist() {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getWishlistAction();
      setWishlists(data);
      setIsLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    function handleUpdate(e: Event) {
      const detail = (e as CustomEvent).detail;
      setWishlists((prev) => prev.filter((w) => w.movieId !== detail.movieId));
    }
    window.addEventListener("wishlist:update", handleUpdate as EventListener);
    return () => window.removeEventListener("wishlist:update", handleUpdate as EventListener);
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div>Loading wishlist...</div>
      </div>
    );

  if (wishlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Heart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No items in wishlist</h2>
        <p className="text-muted-foreground mb-6">
          Start adding movies to your wishlist!
        </p>
        <Button asChild>
          <Link href="/browse">Browse Movies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlists.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border overflow-hidden hover:shadow-lg transition-shadow bg-white"
          >
            <Link
              href={`/browse/${item.movie.id}`}
              className="relative block aspect-video bg-muted overflow-hidden"
            >
              <Image
                src={item.movie.imageUrl || placeholder}
                alt={item.movie.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <div className="p-4 space-y-3">
              <Link
                href={`/browse/${item.movie.id}`}
                className="hover:underline block"
              >
                <h3 className="font-semibold line-clamp-2">
                  {item.movie.title}
                </h3>
              </Link>
              <div className="text-lg font-bold text-green-600">
                <PriceDisplay price={item.movie.price} />
              </div>
              <div className="flex gap-2">
                <AddToWishlistButton movieId={item.movie.id} size="sm" />
                <AddToCartButton
                  movieId={item.movie.id}
                  size="sm"
                  disabled={
                    !item.movie.isAvailable || item.movie.stock === 0
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}