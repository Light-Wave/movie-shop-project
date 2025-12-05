import { Movie } from "@/generated/prisma/client";
type Params = { movie: Movie } | { price: number };

export default function PriceDisplay(params: Params) {
  // In the future this could be used to convert to other currencies
  let _price: number;
  if ("movie" in params) {
    _price = params.movie.price;
  } else {
    _price = params.price;
  }
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(_price / 100);
  return <>{formatted}</>;
}
