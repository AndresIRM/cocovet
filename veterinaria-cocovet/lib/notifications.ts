import nodemailer from "nodemailer";
import { formatAppointmentDateTime } from "./booking";
import { buildCancelUrl } from "./urls";

type NotifyInput = {
  ownerName: string;
  email: string;
  phone: string;
  petName: string;
  petType: string;
  service: string;
  appointmentDate: Date;
  cancelToken: string;
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
    from: `"Cocovet" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

export async function notifyAppointmentCreated(input: NotifyInput) {
  const vetEmail = process.env.VET_NOTIFICATION_EMAIL ?? "";
  const dateText = formatAppointmentDateTime(input.appointmentDate);
  const cancelUrl = buildCancelUrl(input.cancelToken);

  const subjectClient = "Confirmación de cita - Cocovet";
  const subjectVet = "Nueva cita agendada - Cocovet";

  const clientHtml = `
    <div style="font-family: Arial, sans-serif; color:#1e293b;">
      <h2>Tu cita fue registrada correctamente</h2>
      <p>Hola <strong>${input.ownerName}</strong>, tu cita en <strong>Cocovet</strong> ha sido agendada.</p>
      <ul>
        <li><strong>Mascota:</strong> ${input.petName}</li>
        <li><strong>Tipo:</strong> ${input.petType}</li>
        <li><strong>Servicio:</strong> ${input.service}</li>
        <li><strong>Fecha y hora:</strong> ${dateText}</li>
      </ul>
      <p>Si deseas cancelar tu cita, usa el siguiente enlace:</p>
      <p>
        <a href="${cancelUrl}" style="background:#b0235a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
          Cancelar cita
        </a>
      </p>
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
      <p>Enlace de cancelación de esta cita:</p>
      <p>
        <a href="${cancelUrl}" style="background:#b0235a;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block;">
          Cancelar cita
        </a>
      </p>
    </div>
  `;

  await Promise.all([
    sendEmail(input.email, subjectClient, clientHtml),
    sendEmail(vetEmail, subjectVet, vetHtml),
  ]);
}