import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        sun: "#FFC83A",
        ink: "#0F172A",
        graphite: "#1F2937",
        cloud: "#F9FAFB",
        stone: "#6B7280",
        card: "#FFFFFF",
        line: "#E5E7EB"
      },
      boxShadow: { soft: "0 10px 30px rgba(15,23,42,0.06)" },
      borderRadius: { xl2: "1.25rem" }
    }
  },
  plugins: []
} satisfies Config;
