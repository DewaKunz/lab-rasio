import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Laboratorium Rasio 🧪 Petualangan Matematika Seru!",
  description: "Game edukasi matematika rasio berbasis Teori APOS yang ramah anak.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#E0F2FE] text-slate-900 font-sans antialiased text-lg selection:bg-yellow-300 selection:text-slate-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
