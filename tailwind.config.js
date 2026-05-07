/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        slate: {
          50: '#F8FAFC',
          900: '#0F172A',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        '7xl': '80rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
