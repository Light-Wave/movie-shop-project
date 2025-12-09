import { ArtistRole } from "@/generated/prisma/enums";

export function roleToString(role: ArtistRole): string {
  switch (role) {
    case ArtistRole.DIRECTOR:
      return "Director";
    case ArtistRole.ACTOR:
      return "Actor";
    default:
      console.error("Unknown role:", role);
      return "Special Thanks";
  }
}
