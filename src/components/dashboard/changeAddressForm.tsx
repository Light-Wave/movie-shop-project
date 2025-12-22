"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { addressSchema, AddressSchemaValues } from "@/zod/address";
import { prisma } from "@/lib/prisma";
import { Address } from "@/generated/prisma/client";

type Params = {
  billingAddress: Address | null | undefined;
  deliveryAddress: Address | null | undefined;
};

export default function ChangeAddressForm(params: Params) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const deliveryForm = useForm<AddressSchemaValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  async function onSubmit(values: AddressSchemaValues) {
    setIsLoading(true);
    try {
      const result = await authClient.changeEmail({
        newEmail: values.email,
      });
      if (result.error) {
        toast("Error", {
          description: result.error.message || "Failed to change email",
        });
      } else {
        toast("Success", {
          description: "Email changed successfully",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      toast("Error", {
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex min-h-screen justify-center">
      <div className="w-full max-w-md space-y-6 px-4">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Change your Email</h1>
          <p className="text-muted-foreground">Enter your new email.</p>
        </div>
        <Form {...deliveryForm}>
          <form
            onSubmit={deliveryForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={deliveryForm.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input type="string" {...field} disabled={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Working..." : "Change Email"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
