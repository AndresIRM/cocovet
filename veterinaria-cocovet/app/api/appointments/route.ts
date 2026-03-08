import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  buildAppointmentDate,
  isHourAligned,
  isValidSlot,
} from "@/lib/booking";
import { notifyAppointmentCreated } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const ownerName = String(body.ownerName ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const email = String(body.email ?? "").trim();
    const petName = String(body.petName ?? "").trim();
    const petTypeId = Number(body.petTypeId);
    const serviceId = Number(body.serviceId);
    const date = String(body.date ?? "").trim();
    const time = String(body.time ?? "").trim();

    if (
      !ownerName ||
      !phone ||
      !email ||
      !petName ||
      !date ||
      !time ||
      !Number.isFinite(petTypeId) ||
      !Number.isFinite(serviceId)
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (!isHourAligned(time)) {
      return NextResponse.json(
        { error: "El horario debe ser exacto por hora" },
        { status: 400 }
      );
    }

    if (!isValidSlot(date, time)) {
      return NextResponse.json(
        { error: "El horario no está dentro del horario laboral" },
        { status: 400 }
      );
    }

    const appointmentDate = buildAppointmentDate(date, time);

    const [petType, service, existing] = await Promise.all([
      prisma.petType.findUnique({ where: { id: petTypeId } }),
      prisma.service.findUnique({ where: { id: serviceId } }),
      prisma.appointment.findFirst({
        where: {
          date: appointmentDate,
        },
      }),
    ]);

    if (!petType) {
      return NextResponse.json(
        { error: "El tipo de mascota no existe" },
        { status: 400 }
      );
    }

    if (!service) {
      return NextResponse.json(
        { error: "El servicio no existe" },
        { status: 400 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Ese horario ya está ocupado" },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        ownerName,
        phone,
        email,
        petName,
        petTypeId,
        serviceId,
        date: appointmentDate,
      },
      include: {
        petType: true,
        service: true,
      },
    });

    const notifications = await notifyAppointmentCreated({
      ownerName,
      phone,
      email,
      petName,
      petType: petType.type,
      service: service.name,
      appointmentDate,
    });

    return NextResponse.json({
      ok: true,
      appointment,
      notifications,
    });
  } catch (error) {
    console.error("POST /api/appointments error", error);
    return NextResponse.json(
      { error: "No se pudo crear la cita" },
      { status: 500 }
    );
  }
}