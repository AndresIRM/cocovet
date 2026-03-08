import "./globals.css";

export const metadata = {
  title: "CocoVet - Hospital Veterinario",
  description: "Hospital Veterinario - Atlacomulco, Estado de México - Veterinaria CocoVet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}