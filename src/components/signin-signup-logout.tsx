"use client";

import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SignInOrOutProps extends React.ComponentProps<typeof Button> {
  orientation?: "horizontal" | "vertical";
  containerClassName?: string;
}

export default function SignInOrOut({
  orientation = "horizontal",
  containerClassName,
  className,
  ...props
}: SignInOrOutProps) {
  const session = authClient.useSession();
  const router = useRouter();

  return (
    <div className={cn("flex items-center", containerClassName)}>
      {session.data === null ? (
        <ButtonGroup orientation={orientation} className="w-full">
          <Button
            variant="outline"
            asChild
            className={cn("flex-1", className)}
            {...props}
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className={cn("flex-1", className)}
            {...props}
          >
            <Link href="/register">Register</Link>
          </Button>
        </ButtonGroup>
      ) : (
        <Button
          className={cn(className)}
          onClick={async () => {
            await authClient.signOut();
            router.push("/");
            router.refresh();
          }}
          {...props}
        >
          Sign out
        </Button>
      )}
    </div>
  );
}
