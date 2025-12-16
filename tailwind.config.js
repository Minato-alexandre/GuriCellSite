/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        // Adicionamos a configuração aqui
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
}