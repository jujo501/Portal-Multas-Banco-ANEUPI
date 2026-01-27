/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Puedes agregar tus colores personalizados aquí si lo deseas
        // Pero con tu sistema de variables CSS no es necesario
      },
    },
  },
  plugins: [],
}