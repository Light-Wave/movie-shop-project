import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number(),
  releaseDate: z.coerce.date().optional(),
  imageUrl: z.string().url().optional(),
  stock: z.coerce.number().default(0),
  runtime: z.coerce.number().optional(),
});
