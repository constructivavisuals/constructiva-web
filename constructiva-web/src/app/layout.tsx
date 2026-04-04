import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Constructiva.cz — Marketingová agentura pro stavebnictví",
  description:
    "Stavíme viditelnost vašich projektů. Marketingová agentura specializovaná na stavebnictví a development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
