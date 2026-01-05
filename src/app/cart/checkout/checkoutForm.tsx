"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import { Address } from "@/generated/prisma/client";
import { updateAddress } from "@/server-actions/userData/address";
import { checkoutSchema, CheckoutSchemaValues } from "@/zod/checkout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { checkoutAction } from "@/server-actions/cart/cartActions";
import broadcastCartUpdate from "@/lib/broadcastCartUpdate";

type Params = {
  billingAddress: Address | null | undefined;
  deliveryAddress: Address | null | undefined;
  email?: string;
};

export default function CheckoutForm({
  billingAddress,
  deliveryAddress,
  email,
}: Params) {
  // Let react-hook-form infer types from the resolver to avoid type mismatches
  const form = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: email ?? "",
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

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<CheckoutSchemaValues | null>(null);

  const router = useRouter();

  async function checkAddresses(values: CheckoutSchemaValues) {
    const addressesChanged =
      email && // if we have an email, a user is logged in
      (!billingAddress ||
        !deliveryAddress ||
        billingAddress.city !== values.billing_city ||
        billingAddress.street !== values.billing_street ||
        billingAddress.zipCode !== values.billing_zipCode ||
        billingAddress.country !== values.billing_country ||
        deliveryAddress.city !== values.delivery_city ||
        deliveryAddress.street !== values.delivery_street ||
        deliveryAddress.zipCode !== values.delivery_zipCode ||
        deliveryAddress.country !== values.delivery_country);

    setPendingValues(values);
    if (addressesChanged) {
      // open confirmation dialog
      setShowSaveDialog(true);
      return;
    } else {
      try {
        const res = await checkoutAction(values);
        if (res && "error" in res) {
          const msg = Array.isArray(res.error)
            ? JSON.stringify(res.error)
            : res.error;
          toast.error("Checkout failed", { description: String(msg) });
        } else if (res && "success" in res && res.success) {
          // success — notify other components/tabs and navigate if redirect provided
          broadcastCartUpdate();
          if (res.redirect) {
            router.push(res.redirect);
          } else {
            toast.success("Order placed");
          }
        }
      } catch (err) {
        toast.error("Error during checkout", { description: String(err) });
      } finally {
        setPendingValues(null);
      }
    }
  }
  async function onSubmit() {
    if (!pendingValues) return;
    try {
      const res = await checkoutAction(pendingValues);

      if (res && "error" in res) {
        const msg = Array.isArray(res.error)
          ? JSON.stringify(res.error)
          : res.error;
        toast.error("Checkout failed", { description: String(msg) });
      } else if (res && "success" in res && res.success) {
        broadcastCartUpdate();
        if (res.redirect) {
          router.push(res.redirect);
        } else {
          toast.success("Order placed");
        }
      }
    } catch (err) {
      toast.error("Error during checkout", { description: String(err) });
    } finally {
      setPendingValues(null);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(checkAddresses)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem hidden={!!email}>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit" className="w-full">
            Place Order
          </Button>
        </form>
      </Form>
      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save addresses for later?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to save these addresses to your account for future
              use? You can always update or remove them later in your account
              settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                // close dialog and proceed (don't save)
                setShowSaveDialog(false);
                onSubmit();
              }}
            >
              No
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                if (!pendingValues) return;
                setShowSaveDialog(false);

                try {
                  const res = await updateAddress(pendingValues);
                  if (res?.success) {
                    toast.success("Address updated");
                  } else {
                    toast.error("Failed to update address", {
                      description: (res as any)?.error || "Unknown error",
                    });
                  }
                } catch (err) {
                  toast.error("Error saving address", {
                    description: String(err),
                  });
                } finally {
                  onSubmit();
                }
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
