import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 chars"),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  genre: z.string().optional(),
  description: z.string().optional(),
  posterUrl: z.string().url().optional(),
  rating: z.number().int().min(0).max(10).optional(),
});

export type MovieInput = z.infer<typeof movieSchema>;
