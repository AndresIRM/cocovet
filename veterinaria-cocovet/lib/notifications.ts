import nodemailer from "nodemailer";
import { formatAppointmentDateTime } from "./booking";

type NotifyInput = {
  ownerName: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  service: string;
  appointmentDate: Date;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"COCO VET" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export async function notifyAppointmentCreated(input: NotifyInput) {
  const vetEmail = process.env.VET_NOTIFICATION_EMAIL ?? "";
  const dateText = formatAppointmentDateTime(input.appointmentDate);

  const subjectClient = "Confirmación de cita - COCO VET";
  const subjectVet = "Nueva cita agendada - COCO VET";

  const clientHtml = `
    <div style="font-family: Arial, sans-serif; color:#1e293b;">
      <h2>Tu cita fue registrada correctamente</h2>
      <p>Hola <strong>${input.ownerName}</strong>, tu cita en <strong>COCO VET</strong> ha sido agendada.</p>
      <ul>
        <li><strong>Mascota:</strong> ${input.petName}</li>
        <li><strong>Tipo:</strong> ${input.petType}</li>
        <li><strong>Servicio:</strong> ${input.service}</li>
        <li><strong>Fecha y hora:</strong> ${dateText}</li>
      </ul>
    </div>
  `;

  const vetHtml = `
    <div style="font-family: Arial, sans-serif; color:#1e293b;">
      <h2>Nueva cita agendada</h2>
      <ul>
        <li><strong>Cliente:</strong> ${input.ownerName}</li>
        <li><strong>Teléfono:</strong> ${input.phone}</li>
        <li><strong>Email:</strong> ${input.email}</li>
        <li><strong>Mascota:</strong> ${input.petName}</li>
        <li><strong>Tipo:</strong> ${input.petType}</li>
        <li><strong>Servicio:</strong> ${input.service}</li>
        <li><strong>Fecha y hora:</strong> ${dateText}</li>
      </ul>
    </div>
  `;

  await Promise.all([
    sendEmail(input.email, subjectClient, clientHtml),
    sendEmail(vetEmail, subjectVet, vetHtml),
  ]);
}