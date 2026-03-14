import { Suspense } from "react";
import CancelarCitaClient from "./CancelarCitaClient";

function LoadingCard() {
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
          Cargando información...
        </p>
      </div>
    </main>
  );
}

export default function CancelarCitaPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <CancelarCitaClient />
    </Suspense>
  );
}