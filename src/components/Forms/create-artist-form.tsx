"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createArtistSchema } from "@/zod/artists"; // Changed to createArtistSchema
import { createArtist } from "@/server-actions/artists/create"; // Changed to createArtist

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Assuming toast is available for notifications

export function CreateArtistForm() { // Removed artist prop
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createArtistSchema),
    defaultValues: {
      name: "",
      bio: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: any) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) formData.append(key, value as string);
    }

    startTransition(async () => {
      const res = await createArtist(formData);

      if (res.error) {
        console.error("Error creating artist:", res.error);
        toast.error("Failed to create artist.");
      } else {
        console.log("Artist created successfully!", res);
        toast.success("Artist created successfully!");
        form.reset(); // Optionally reset the form after successful creation
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* NAME */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Artist name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DESCRIPTION */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input placeholder="Short description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* IMAGE URL */}
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Artist"}
        </Button>
      </form>
    </Form>
  );
}
