import { z } from "zod";

export const createGenreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export const updateGenreSchema = z.object({
  id: z.string().uuid({ message: "Invalid genre ID" }),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
});
