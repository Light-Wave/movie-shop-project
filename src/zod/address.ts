import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().min(1, "Zip Code is required"),
  country: z.string().min(1, "Country is required"),
});

export type AddressSchemaValues = z.infer<typeof addressSchema>;
