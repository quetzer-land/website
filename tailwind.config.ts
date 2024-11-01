import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      secondWhite: { 50: "#FAFAFF", 100: "#F2F2FF", 200: "#E0E0E0" },
      gray: "#c5c3c3",
      black: "#000000",
      red: {
        100: "red",
        200: "#BE3636",
      },
      primary: "#00bf63",
      hover: "#8ffF00",
      slate: { 700: "#334155", 800: "#1e293b", 900: "#0f172a", 950: "#020617" },
    },
    fontFamily: {
      zamanda: ["Zamanda"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
