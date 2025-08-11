/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        'work-sans': ['work-sans', 'sans-serif'],
      },
      animation: {
        'squeeze': 'squeeze 0.3s ease-in-out',
        'flip-vertical': 'flip-vertical 0.3s ease-in-out',
        'slide-in-top': 'slide-in-top 0.3s ease-in-out',
      },
      keyframes: {
        squeeze: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        'flip-vertical': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'slide-in-top': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        '45': '11.25rem',
      },
    },
  },
  plugins: [],
}
