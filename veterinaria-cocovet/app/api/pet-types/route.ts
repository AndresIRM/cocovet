import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const petTypes = await prisma.petType.findMany({
      orderBy: { type: "asc" },
    });

    return NextResponse.json(petTypes);
  } catch (error) {
    console.error("GET /api/pet-types error", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los tipos de mascota" },
      { status: 500 }
    );
  }
}