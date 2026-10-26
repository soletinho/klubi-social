import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        klubi: {
          primary: "#1E40AF",      // Azul profundo e moderno
          secondary: "#3B82F6",    // Azul elétrico amigável
          accent: "#E11D48",       // Coral/Pink vibrante autoral
          "accent-hover": "#BE123C",
          light: "#EFF6FF",        // Fundo sutil para cabeçalhos e chips
          bg: "#F8FAFC",           // Fundo geral limpo e descansado
          border: "#E2E8F0",       // Borda suave moderna
          gold: "#F59E0B",         // Estrela de fã / destaque
          trusty: "#EAB308",       // Confiável
          cool: "#06B6D4",         // Legal (ciano)
          sexy: "#F43F5E",         // Carismático / Sexy (rosa avermelhado)
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        klubi: "0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        card: "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
