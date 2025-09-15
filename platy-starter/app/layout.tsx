import "./globals.css";
import { Sora, Work_Sans } from "next/font/google";

const sora = Sora({ subsets: ["latin"], variable: "--font-head", weight: ["400","600","700","800"] });
const work = Work_Sans({ subsets: ["latin"], variable: "--font-body", weight: ["400","500","600"] });

export const metadata = { title: "platy", description: "Menús inteligentes, ahorro real" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${work.variable} bg-cloud text-ink`}>
        {children}
      </body>
    </html>
  );
}
