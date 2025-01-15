const { text } = require("framer-motion/client");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", 

  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui"],
      "plus-jakarta-sans": [
        '"Plus Jakarta Sans"',
        "ui-sans-serif",
        "system-ui",
      ],
    },
    extend: {
      colors: {
        dark: {
          theme1: " #10141F",
          theme2: " #1C2234",
          theme3: "#2E3445",
          text: "#fff",
          text2: "#000",

          active:"#3DC2FF"

        },
        light: {
          theme1: "#f5f5f5",
          theme2: "#f5f5f5",
          theme3: "#f5f5f5",
          text: "#000",
          text2: "#fff",
          active:"#3DC2FF"
        },
      },
    },
  },
  plugins: [],
};