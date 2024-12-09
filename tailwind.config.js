/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'switzer-regular': ['Switzer Regular', 'sans-serif'],
        'switzer-medium': ['Switzer Medium', 'sans-serif'],
        'switzer-bold': ['Switzer Bold', 'sans-serif'],
        'switzer-black': ['Switzer Black', 'sans-serif'],
        'switzer-semibold': ['Switzer SemiBold', 'sans-serif'],
        'general-regular': ['General Sans Regular', 'sans-serif'],
        'general-medium': ['General Sans Medium', 'sans-serif'],
        'general-bold': ['General Sans Bold', 'sans-serif'],
        'general-semibold': ['General Sans Semibold', 'sans-serif'],
        'urbanist': ['Urbanist', 'sans-serif'],
      },
      colors: {
        'primary-black': '#181818',
        'primary-white': '#f6f6f6',
      },
      fontSize: {
        '30xl': '34rem',
        '20xl': '20rem',
      },
      screens: {
        'mobile': '300px',
        'tablet': '768px',
        'desktop': '1500px'
      }
    },
  },
  plugins: [],
}