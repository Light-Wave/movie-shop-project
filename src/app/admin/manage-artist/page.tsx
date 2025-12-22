import { prisma } from "@/lib/prisma";
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

async function getArtists() {
  return prisma.artist.findMany();
}

function UpdateArtistForm({ artist }: { artist: any }) {
  "use client";

  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(updateArtistSchema),
    defaultValues: {
      name: artist.name ?? "",
      bio: artist.bio ?? "",
      imageUrl: artist.imageUrl ?? "",
    },
  });

  async function onSubmit(values: any) {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value !== undefined) formData.append(key, value as string);
    }
    formData.append("id", artist.id);

    startTransition(async () => {
      const res = await updateArtist(formData);

      if (res.error) {
        toast.error(res.error.toString());
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

export default async function ManageArtistsPage() {
  const artists = await getArtists();

  return (
    <div>
      <h1>Manage Artists</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist) => (
          <div key={artist.id} className="p-4 border rounded-lg">
            <UpdateArtistForm artist={artist} />
          </div>
        ))}
      </div>
    </div>
  );
}
