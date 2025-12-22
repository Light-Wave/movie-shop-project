"use client";

import React from "react";

/**
 * Placeholder cart logic hook to be replaced with real cart logic, entire function to be replaced
 */
export function useCartPlaceholder() {
    const handleAddToCart = (e: React.MouseEvent | React.TouchEvent, movieTitle: string) => {
        if (e && 'preventDefault' in e) {
            e.preventDefault();
            e.stopPropagation();
        }
        alert(`${movieTitle} added to cart!`);
    };

    return { handleAddToCart };
}
