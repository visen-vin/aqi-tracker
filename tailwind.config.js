/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aqi-good': '#00e400',
        'aqi-moderate': '#ffff00',
        'aqi-poor': '#ff7e00',
        'aqi-unhealthy': '#ff0000',
        'aqi-severe': '#8f3f97',
        'aqi-hazardous': '#7e0023',

        'bg-deep': 'rgb(11 15 25 / <alpha-value>)',
        'bg-layer-1': 'rgba(30, 41, 59, 0.4)',
        'bg-layer-2': 'rgba(30, 41, 59, 0.7)',

        'text-primary': '#f1f5f9',
        'text-secondary': '#cbd5e1',
        'text-tertiary': '#94a3b8',

        'neon-cyan': '#00f0ff',
        'neon-green': '#39ff14',

        'border-light': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      height: {
        'header': '64px',
      },
      spacing: {
        'header': '64px',
      },
    },
  },
  plugins: [],
}
