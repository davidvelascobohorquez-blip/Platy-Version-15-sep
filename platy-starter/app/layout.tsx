import "./globals.css";
import { Sora, Manrope } from "next/font/google";

const sora = Sora({ subsets: ["latin"], variable: "--font-head", weight: ["400", "600", "700", "800"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });

export const metadata = {
  title: "platy",
  description: "Menús inteligentes, ahorro real",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },
  openGraph: {
    title: "platy — Menús inteligentes, ahorro real",
    images: ["/og.jpg"]
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#0F172A"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${manrope.variable}`}>
        {children}
      </body>
    </html>
  );
}

