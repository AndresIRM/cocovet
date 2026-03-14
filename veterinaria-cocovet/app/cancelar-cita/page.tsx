"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CancelarCitaPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "already" | "error">("loading");
  const [message, setMessage] = useState("Procesando cancelación...");

  useEffect(() => {
    const cancelAppointment = async () => {
      if (!token) {
        setStatus("error");
        setMessage("El enlace de cancelación no es válido.");
        return;
      }

      try {
        const res = await fetch("/api/appointments/cancel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.error ?? "No se pudo cancelar la cita.");
          return;
        }

        if (data?.alreadyCancelled) {
          setStatus("already");
          setMessage("Esta cita ya había sido cancelada anteriormente.");
          return;
        }

        setStatus("success");
        setMessage("Tu cita fue cancelada correctamente.");
      } catch {
        setStatus("error");
        setMessage("Ocurrió un error al cancelar la cita.");
      }
    };

    cancelAppointment();
  }, [token]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7f3",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "640px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "28px",
          padding: "32px",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#0f172a" }}>
          Cancelación de cita
        </h1>

        <p style={{ marginTop: "18px", color: "#475569", lineHeight: 1.8 }}>
          {message}
        </p>

        <div style={{ marginTop: "24px" }}>
          <a
            href="/"
            style={{
              display: "inline-block",
              background: status === "success" || status === "already" ? "#63b346" : "#b0235a",
              color: "#fff",
              textDecoration: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              fontWeight: 700,
            }}
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
}