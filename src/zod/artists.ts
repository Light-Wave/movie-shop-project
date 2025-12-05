import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
});

export const updateArtistSchema = createArtistSchema.extend({
  id: z.string().min(1, "ID is required"),
});