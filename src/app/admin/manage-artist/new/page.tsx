"use client";

import { useActionState } from "react";
import { createArtist } from "@/server-actions/artists/create";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const initialState = {
  error: null,
  success: false,
};

export default function NewArtistPage() {
  const [state, formAction] = useActionState(createArtist as any, initialState);

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Create New Artist</CardTitle>
          <CardDescription>
            Fill out the form to add a new artist to the database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Artist's Name"
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" placeholder="Artist's Biography" />
            </div>
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <Button type="submit">Create Artist</Button>
            {state?.error && (
              <p className="text-red-500">{JSON.stringify(state.error)}</p>
            )}
            {state?.success && (
              <p className="text-green-500">Artist created successfully!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
