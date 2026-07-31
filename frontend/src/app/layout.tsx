import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProLeague - Gestão de Campeonatos",
  description: "A plataforma mais completa para o seu torneio de futebol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} font-sans h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-zinc-950 text-zinc-50">{children}</body>
    </html>
  );
}
