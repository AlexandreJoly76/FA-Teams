/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        club: {
          black: '#000000',  // Noir FA Roumois
          green: '#00C75B',  // Vert FA Roumois
          gold: '#C5A22E',   // Doré
          red: '#FF0000',    // Rouge
        },
      },
    },
  },
  plugins: [],
};