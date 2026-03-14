import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAppointmentCancelled } from "@/lib/cancelar-notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { cancelToken: token },
      include: {
        petType: true,
        service: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "La cita no existe" },
        { status: 404 }
      );
    }

    if (appointment.status === "cancelled") {
      return NextResponse.json({
        ok: true,
        alreadyCancelled: true,
      });
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { cancelToken: token },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
      include: {
        petType: true,
        service: true,
      },
    });

    await notifyAppointmentCancelled({
      ownerName: updatedAppointment.ownerName,
      phone: updatedAppointment.phone,
      email: updatedAppointment.email,
      petName: updatedAppointment.petName,
      petType: updatedAppointment.petType.type,
      service: updatedAppointment.service.name,
      appointmentDate: updatedAppointment.date,
    });

    return NextResponse.json({
      ok: true,
      cancelled: true,
    });
  } catch (error) {
    console.error("POST /api/appointments/cancel error", error);
    return NextResponse.json(
      { error: "No se pudo cancelar la cita" },
      { status: 500 }
    );
  }
}