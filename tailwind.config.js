/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Karla', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#0a0a0f',
        surface: '#12121a',
        'surface-hover': '#1a1a25',
        border: '#2a2a3a',
        primary: '#6366f1',
        'primary-hover': '#4f46e5',
        success: '#22c55e',
        danger: '#ef4444',
        warning: '#f59e0b',
        muted: '#6b7280',
      },
    },
  },
  plugins: [],
}
