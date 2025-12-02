import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { movieSchema } from "@/schemas/movieSchema";
import { MovieInput } from "@/schemas/movieSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated: MovieInput = movieSchema.parse(body);

    const movie = await prisma.movie.create({
      data: { ...validated, price: 0 },
    }); // Add a default price

    return NextResponse.json(movie, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
