import { z } from "zod";

export const changeEmailSchema = z.object({
  oldEmail: z.string().optional(),
  email: z.email("Invalid email address"),
});

export type ChangeEmailValues = z.infer<typeof changeEmailSchema>;
