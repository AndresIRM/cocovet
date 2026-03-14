import nodemailer from "nodemailer";
import { formatAppointmentDateTime } from "./booking";

type CancelNotifyInput = {
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

export async function notifyAppointmentCancelled(input: CancelNotifyInput) {
  const vetEmail = process.env.VET_NOTIFICATION_EMAIL ?? "";
  const dateText = formatAppointmentDateTime(input.appointmentDate);

  const subjectClient = "Cita cancelada - COCO VET";
  const subjectVet = "Cita cancelada - COCO VET";

  const clientHtml = `
    <div style="font-family: Arial, sans-serif; color:#1e293b;">
      <h2>Tu cita fue cancelada correctamente</h2>
      <p>Hola <strong>${input.ownerName}</strong>, te confirmamos que tu cita en <strong>COCO VET</strong> fue cancelada.</p>
      <ul>
        <li><strong>Mascota:</strong> ${input.petName}</li>
        <li><strong>Tipo:</strong> ${input.petType}</li>
        <li><strong>Servicio:</strong> ${input.service}</li>
        <li><strong>Fecha y hora:</strong> ${dateText}</li>
      </ul>
      <p>Si deseas agendar nuevamente, puedes hacerlo desde nuestro sitio.</p>
    </div>
  `;

  const vetHtml = `
    <div style="font-family: Arial, sans-serif; color:#1e293b;">
      <h2>Una cita fue cancelada</h2>
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