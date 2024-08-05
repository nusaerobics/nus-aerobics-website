/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        display: ["var(--font-noto-serif-display)"],
      },
      colors: {
        primary: "#1F4776",
        "a-navy": "#1F4776",
        "a-black": "#393E46",
        "a-pink": "#FCF0F2",
        "a-green": "#2A9E2F",
        "a-red": "#9E2A2A",
      },
      screens: {
        sm: "325px",
        md: "525px",
        lg: "812px",
      },
      fontSize: {
        xs: "0.5rem",
        sm: "0.8rem",
        base: "1rem",
        xl: "1.25rem",
        "2xl": "1.563rem",
        "3xl": "1.953rem",
        "4xl": "2.441rem",
        "5xl": "3.052rem",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({})],
};
