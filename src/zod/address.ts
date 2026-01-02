import { z } from "zod";

// Coerce common checkbox/string values into a boolean
const booleanCoerce = z.preprocess((val) => {
  if (val === undefined || val === null) return false;
  if (typeof val === "string") {
    const s = val.toLowerCase();
    return s === "true" || s === "on" || s === "1";
  }
  return Boolean(val);
}, z.boolean());

export const addressSchema = z
  .object({
    delivery_street: z.string().min(1, "Street is required"),
    delivery_city: z.string().min(1, "City is required"),
    delivery_state: z.string().optional(),
    delivery_zipCode: z.string().min(1, "Zip Code is required"),
    delivery_country: z.string().min(1, "Country is required"),

    // default to false when not present
    useSeparateBilling: booleanCoerce.default(false),

    // billing fields are optional in raw input; we'll validate them conditionally
    billing_street: z.string().optional(),
    billing_city: z.string().optional(),
    billing_state: z.string().optional(),
    billing_zipCode: z.string().optional(),
    billing_country: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // When separate billing is requested, billing fields are required
    if (val.useSeparateBilling) {
      if (!val.billing_street) {
        ctx.addIssue({
          path: ["billing_street"],
          code: z.ZodIssueCode.custom,
          message: "Billing street is required when using separate billing",
        });
      }
      if (!val.billing_city) {
        ctx.addIssue({
          path: ["billing_city"],
          code: z.ZodIssueCode.custom,
          message: "Billing city is required when using separate billing",
        });
      }
      if (!val.billing_zipCode) {
        ctx.addIssue({
          path: ["billing_zipCode"],
          code: z.ZodIssueCode.custom,
          message: "Billing zip code is required when using separate billing",
        });
      }
      if (!val.billing_country) {
        ctx.addIssue({
          path: ["billing_country"],
          code: z.ZodIssueCode.custom,
          message: "Billing country is required when using separate billing",
        });
      }
    }
  })
  .transform((val) => {
    // If not using separate billing, copy delivery into billing so downstream code can rely on billing_* fields existing
    if (!val.useSeparateBilling) {
      return {
        ...val,
        useSeparateBilling: false,
        billing_street: val.delivery_street,
        billing_city: val.delivery_city,
        billing_state: val.delivery_state ?? undefined,
        billing_zipCode: val.delivery_zipCode,
        billing_country: val.delivery_country,
      };
    }
    return val;
  });

export type AddressSchemaValues = z.infer<typeof addressSchema>;
