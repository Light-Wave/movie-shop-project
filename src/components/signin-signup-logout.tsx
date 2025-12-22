"use client";

import { auth } from "@/lib/auth";
import { ButtonProps } from "react-day-picker";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Params = ButtonProps;

export default function SignInOrOut(params: Params) {
  const session = authClient.useSession();
  return (
    <>
      {session.data === null ? (
        <ButtonGroup>
          <Button {...params} variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button {...params} variant="outline" asChild>
            <Link href="/register">Register</Link>
          </Button>
        </ButtonGroup>
      ) : (
        <Button
          {...params}
          onClick={async () => {
            authClient.signOut();
          }}
        >
          Sign out
        </Button>
      )}
    </>
  );
}
