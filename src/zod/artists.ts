import { z } from "zod";

export const createArtistSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  imageUrl: z.union([z.string().url("INVALID URL"), z.literal("")]),
});

export const updateArtistSchema = createArtistSchema.extend({
  id: z.string().min(1, "ID is required"),
});
