"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { toast } from "sonner";
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
import { Checkbox } from "@/components/ui/checkbox";
import { addressSchema, AddressSchemaValues } from "@/zod/address";
import { Address } from "@/generated/prisma/client";
import {
  deleteAddresses,
  updateAddress,
} from "@/server-actions/userData/address";

type Params = {
  billingAddress: Address | null | undefined;
  deliveryAddress: Address | null | undefined;
};

export default function ChangeAddressForm({
  billingAddress,
  deliveryAddress,
}: Params) {
  const [isPending, startTransition] = useTransition();

  // Let react-hook-form infer types from the resolver to avoid type mismatches
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      delivery_street: deliveryAddress?.street ?? "",
      delivery_city: deliveryAddress?.city ?? "",
      delivery_state: deliveryAddress?.state ?? "",
      delivery_zipCode: deliveryAddress?.zipCode ?? "",
      delivery_country: deliveryAddress?.country ?? "",

      useSeparateBilling: Boolean(
        billingAddress &&
          (billingAddress.city !== deliveryAddress?.city ||
            billingAddress.street !== deliveryAddress?.street ||
            billingAddress.zipCode !== deliveryAddress?.zipCode ||
            billingAddress.country !== deliveryAddress?.country)
      ),

      billing_street: billingAddress?.street ?? "",
      billing_city: billingAddress?.city ?? "",
      billing_state: billingAddress?.state ?? "",
      billing_zipCode: billingAddress?.zipCode ?? "",
      billing_country: billingAddress?.country ?? "",
    },
  });

  const useSeparateBilling = Boolean(form.watch("useSeparateBilling"));

  // Track whether user has saved addresses so we can hide Delete button after deletion
  const [hasSavedAddresses, setHasSavedAddresses] = useState(
    Boolean(billingAddress || deliveryAddress)
  );

  async function onSubmit(values: AddressSchemaValues) {
    console.log("Submitting address:", values);
    startTransition(async () => {
      try {
        const formData = new FormData();
        // Append delivery fields
        formData.append("delivery_street", values.delivery_street);
        formData.append("delivery_city", values.delivery_city);
        formData.append("delivery_state", values.delivery_state ?? "");
        formData.append("delivery_zipCode", values.delivery_zipCode);
        formData.append("delivery_country", values.delivery_country);

        // Append useSeparateBilling as string
        formData.append(
          "useSeparateBilling",
          values.useSeparateBilling ? "true" : "false"
        );

        // Always append billing fields: if separate billing is false, copy delivery values
        const billingStreet = values.useSeparateBilling
          ? values.billing_street
          : values.delivery_street;
        const billingCity = values.useSeparateBilling
          ? values.billing_city
          : values.delivery_city;
        const billingState = values.useSeparateBilling
          ? values.billing_state
          : values.delivery_state;
        const billingZip = values.useSeparateBilling
          ? values.billing_zipCode
          : values.delivery_zipCode;
        const billingCountry = values.useSeparateBilling
          ? values.billing_country
          : values.delivery_country;

        formData.append("billing_street", billingStreet ?? "");
        formData.append("billing_city", billingCity ?? "");
        formData.append("billing_state", billingState ?? "");
        formData.append("billing_zipCode", billingZip ?? "");
        formData.append("billing_country", billingCountry ?? "");

        const res = await updateAddress(formData);
        if (res?.success) {
          toast.success("Address updated");
          // Update local form state to reflect saved addresses so we don't need a page reload
          // The resolver ensures billing fields are present (copied when necessary)
          form.reset(values);
          setHasSavedAddresses(true);
        } else {
          toast.error("Failed to update address", {
            description: (res as any)?.error || "Unknown error",
          });
        }
      } catch (err) {
        toast.error("Error saving address", { description: String(err) });
      }
    });
  }

  async function handleDeleteAddresses() {
    startTransition(async () => {
      try {
        const res = await deleteAddresses();
        if (res.success) {
          toast.success("Addresses deleted");
          // Clear local saved-address flag and reset the form to empty values
          setHasSavedAddresses(false);
          form.reset({
            delivery_street: "",
            delivery_city: "",
            delivery_state: "",
            delivery_zipCode: "",
            delivery_country: "",
            useSeparateBilling: false,
            billing_street: "",
            billing_city: "",
            billing_state: "",
            billing_zipCode: "",
            billing_country: "",
          });
        } else {
          toast.error("Failed to delete addresses", {
            description: (res as any)?.error || "Unknown error",
          });
        }
      } catch (err) {
        toast.error("Error deleting addresses", { description: String(err) });
      }
    });
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h2 className="text-lg font-medium">Delivery Address</h2>

          <FormField
            control={form.control}
            name="delivery_street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street</FormLabel>
                <FormControl>
                  <Input placeholder="Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="delivery_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delivery_zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip Code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="delivery_state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="delivery_country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="useSeparateBilling"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(val: boolean) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormLabel className="!mb-0">
                    Use separate billing address
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {useSeparateBilling && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Billing Address</h2>

              <FormField
                control={form.control}
                name="billing_street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder="Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Zip Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing_state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billing_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : "Save Address"}
            </Button>
          </div>

          {hasSavedAddresses && (
            <div className="flex justify-end">
              <Button
                variant="destructive"
                disabled={isPending}
                onClick={handleDeleteAddresses}
                type="button"
              >
                {isPending ? "..." : "Delete saved addresses"}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
