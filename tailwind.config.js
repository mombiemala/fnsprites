/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: 'hsl(222 89% 55%)',
        background: 'hsl(0 0% 98%)',
        foreground: 'hsl(0 0% 8%)',
        secondary: 'hsl(222 20% 96%)',
        muted: 'hsl(0 0% 92%)',
        border: 'hsl(0 0% 88%)',
      },
      fontFamily: {
        sans: [
          'Overused Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'system-ui',
          'sans-serif',
        ],
        serif: ['IBM Plex Serif', 'Georgia', 'serif'],
        display: ['DM Serif Display', 'Georgia', 'serif'],
      },
      letterSpacing: {
        hero: '-0.01em',
      },
      fontSize: {
        hero: ['clamp(3.5rem, 8vw, 6.5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}