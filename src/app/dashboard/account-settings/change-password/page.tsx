// Implement user registration and login functionality using Better Auth
// Utilize Better Auth default schema for user data

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
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "@/zod/change-password";

export default function ChangePassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordValues) {
    setIsLoading(true);
    try {
      const result = await authClient.changePassword({
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });
      if (result.error) {
        toast("Error", {
          description: result.error.message || "Failed to change password",
        });
      } else {
        toast("Success", {
          description: "Password changed successfully",
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
          <h1 className="text-3xl font-bold">Change your password</h1>
          <p className="text-muted-foreground">
            Enter your old and new password to update your account password.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Working..." : "Change Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
