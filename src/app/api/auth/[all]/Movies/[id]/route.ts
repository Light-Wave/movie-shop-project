import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/schemas/movieSchema";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validated = movieSchema.partial().parse(body);

    const updated = await prisma.movie.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
