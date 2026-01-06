"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StockRibbonProps {
    isAvailable: boolean;
    stock: number | null;
    variant?: "full" | "out-of-stock-only";
    className?: string;
}

/**
 * StockRibbon component displays the stock status of a movie.
 * It can show both "In Stock" and "Out of Stock" (full variant)
 * or only "Out of Stock" (out-of-stock-only variant).
 */
export function StockRibbon({
    isAvailable,
    stock,
    variant = "full",
    className,
}: StockRibbonProps) {
    const isInStock = isAvailable && (stock ?? 0) > 0;

    // If "out-of-stock-only" variant and item is in stock, don't render anything
    if (variant === "out-of-stock-only" && isInStock) {
        return null;
    }

    return (
        <div
            className={cn(
                "absolute -left-8 top-5 z-10 w-32 text-center transform -rotate-45 shadow-lg",
                className
            )}
        >
            <div
                className={cn(
                    "text-[10px] font-black uppercase tracking-wider px-8 py-1.5",
                    isInStock ? "bg-green-600 text-white" : "bg-red-600 text-white"
                )}
            >
                {isInStock ? "In Stock" : "Out of Stock"}
            </div>
        </div>
    );
}
