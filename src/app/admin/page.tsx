// 5. Admin Dashboard (optional)
//  View sales statistics
//  Manage user accounts (using Better Auth features)

import { ArtistBadge } from "@/components/artist-badge";
import { GenreBadge } from "@/components/genre-badge";
import { MovieBadge } from "@/components/movie-badge";
import PriceDisplay from "@/components/prise-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if ((session?.user as any).role !== "admin") {
    redirect("/");
  }

  const [artists, genres, products, users, orders] = await Promise.all([
    prisma.artist.findMany(),
    prisma.genre.findMany(),
    prisma.movie.findMany(),
    prisma.user.findMany(),
    prisma.order.findMany(),
  ]);
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage the application.
      </p>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Artists <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-artist/new"> Add New Artist </Link>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-artist"> Manage Artists </Link>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {artists.map((artist) => (
              <ArtistBadge key={artist.id} artist={artist} adminView={true} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Genres <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-genre/new"> Add New Genre </Link>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-genre"> Manage Genres </Link>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {genres.map((genre) => (
              <GenreBadge key={genre.id} genre={genre} adminView={true} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Movies <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-products/new"> Add New Movie </Link>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-products"> Manage Movies </Link>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {products.map((product) => (
              <MovieBadge
                key={product.id}
                name={product.title}
                id={product.id}
                adminView={true}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Users <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>
        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-users"> Manage Users </Link>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {users.map((user) => (
              <Badge key={user.id}>
                {user.email} - {user.name}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <Button variant="outline" className="mb-4 mt-4" asChild>
          <CollapsibleTrigger>
            Orders <ChevronsUpDown />
          </CollapsibleTrigger>
        </Button>

        <Button variant="default" className="mx-4" asChild>
          <Link href="/admin/manage-orders"> Manage Orders </Link>
        </Button>
        <CollapsibleContent>
          <div className="space-x-1">
            {orders.map((order) => (
              <Badge key={order.id}>
                {users.find((u) => u.id === order.userId)?.email} -{" "}
                {users.find((u) => u.id === order.userId)?.name} -
                <PriceDisplay price={order.totalAmount} /> - {order.status}
              </Badge>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
