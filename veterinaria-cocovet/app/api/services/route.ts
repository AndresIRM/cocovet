import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error("GET /api/services error", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los servicios" },
      { status: 500 }
    );
  }
}