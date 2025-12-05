import { z } from "zod";

export const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.coerce.number(),
  releaseDate: z.coerce.date().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stock: z.coerce.number().default(0),
  runtime: z.coerce.number().optional(),
  genres: z.string().transform((val) => JSON.parse(val)),
  artists: z.string().transform((val) => JSON.parse(val)),
});

export const updateMovieSchema = z.object({
  id: z.string({ message: "Invalid movie id" }),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  price: z
    .union([
      z.coerce.number(),
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
    ])
    .optional(),
  releaseDate: z
    .union([
      z.coerce.date(),
      z.string().transform((val) => (val === "" ? undefined : new Date(val))),
    ])
    .optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  stock: z
    .union([
      z.coerce.number(),
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
    ])
    .optional(),
  runtime: z
    .union([
      z.coerce.number(),
      z.string().transform((val) => (val === "" ? undefined : Number(val))),
    ])
    .optional(),
  genres: z.string().transform((val) => JSON.parse(val)).optional(),
  artists: z.string().transform((val) => JSON.parse(val)).optional(),
});
