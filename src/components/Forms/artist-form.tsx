"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateArtistSchema } from "@/zod/artists";
import { updateArtist } from "@/server-actions/artists/update";

import { toast } from "sonner";
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

export function UpdateArtistForm({ artist }: { artist: any }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(updateArtistSchema),
    defaultValues: {
      id: artist.id,
      name: artist.name ?? "",
      bio: artist.bio ?? "",
      imageUrl: artist.imageUrl ?? "",
    },
  });

  async function onSubmit(values: any) {
    const formData = new FormData();

    // Explicitly add the ID to formData
    formData.append("id", artist.id);

    for (const [key, value] of Object.entries(values)) {
      if (key !== "id" && value !== undefined)
        formData.append(key, value as string);
    }

    startTransition(async () => {
      const res = await updateArtist(formData);

      if (res.error) {
        toast.error("Failed to update artist.", {
          description:
            typeof res.error === "string"
              ? res.error
              : JSON.stringify(res.error),
        });
      } else {
        toast.success("Artist updated successfully!");
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
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}
