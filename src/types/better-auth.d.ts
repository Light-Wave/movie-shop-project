import { Role } from "@/generated/prisma";
import { DefaultSession } from "better-auth";

declare module "better-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "better-auth/jwt" {
  interface JWT {
    role: Role;
  }
}
