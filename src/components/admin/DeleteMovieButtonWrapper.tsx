import { auth } from "@/lib/auth";
import DeleteMovieButton from "../DeleteMovieButton";

type Props = {
  movieId: string;
  movieTitle?: string;
};

export async function DeleteMovieButtonWrapper({ movieId, movieTitle }: Props) {
  const session = await auth.api.getSession();

  if ((session?.user as any)?.role !== "ADMIN") {
    return null;
  }

  return <DeleteMovieButton movieId={movieId} movieTitle={movieTitle} />;
}
