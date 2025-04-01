/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#FFB938',
        'primary-dark': '#FF9500',
        'secondary': "#1E293B",
        'accent': '#FF6B6B',
        'accent-dark': '#FF4949',
        'success': '#4ADE80',
        'info': '#60A5FA',
        'warning': '#FBBF24',
        'blackBG': '#F8FAFC',
        'Favorite': '#FF5841',
        'gradient-1': '#FF9500',
        'gradient-2': '#FFD93D',
        'gradient-3': '#FF6B6B',
        'gradient-4': '#4ADE80'
      },
      fontFamily: {
        'primary' : ["Montserrat", "sans-serif"],
        'secondary' : ["Nunito Sans", "sans-serif"]
      },
      boxShadow: {
        'custom': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'card': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)',
        'hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      },
      backdropBlur: {
        'glass': 'blur(10px)'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-start) 0%, var(--tw-gradient-end) 100%)',
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-start), var(--tw-gradient-end))',
        'gradient-conic': 'conic-gradient(from 0deg, var(--tw-gradient-start), var(--tw-gradient-end))',
        'mesh-pattern': "url('/mesh-gradient.png')"
      }
    },
  },
  plugins: [],
}

