import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

export const updateArtistSchema = z.object({
  id: z.string().uuid({ message: "Invalid artist ID" }),
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
});
