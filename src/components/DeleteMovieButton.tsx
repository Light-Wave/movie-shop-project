"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { deleteMovieAction } from "@/server-actions/movie/delete";

export function DeleteMovieButton({ movieId, movieTitle }: { movieId: string; movieTitle?: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    const formData = new FormData();
    formData.append("movieId", movieId);

    try {
      const result = await deleteMovieAction(formData);
      if (result.success) {
        // Simple feedback + page reload to reflect change
        alert("Movie deleted");
        // reload to reflect deletion; and the server action revalidates paths too....
        window.location.reload();
      } else {
        alert(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Unknown error while deleting movie");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="ml-2">Delete</span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete movie?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{movieTitle ?? movieId}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel asChild>
            <Button variant="secondary">Cancel</Button>
          </AlertDialogCancel>
          <Button variant="destructive" asChild>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteMovieButton;
