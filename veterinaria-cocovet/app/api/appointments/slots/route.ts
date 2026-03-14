import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildSlotStrings,
  getDayRange,
  getBusinessHours,
  filterPastSlotsForToday,
} from "@/lib/booking";

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "La fecha es requerida" },
        { status: 400 }
      );
    }

    const businessHours = getBusinessHours(date);
    if (!businessHours) {
      return NextResponse.json({
        date,
        slots: [],
        closed: true,
      });
    }

    const { start, end } = getDayRange(date);

    const appointments = await prisma.appointment.findMany({
      where: {
        status: "active",
        date: {
          gte: start,
          lte: end,
        },
      },
      select: {
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const allSlots = buildSlotStrings(date);

    const occupied = new Set(
      appointments.map((a) => {
        const dt = new Date(a.date);
        return new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Mexico_City",
        }).format(dt);
      })
    );

    const notOccupied = allSlots.filter((slot) => !occupied.has(slot));
    const available = filterPastSlotsForToday(date, notOccupied);

    return NextResponse.json({
      date,
      slots: available,
      closed: false,
    });
  } catch (error) {
    console.error("GET /api/appointments/slots error", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los horarios" },
      { status: 500 }
    );
  }
}