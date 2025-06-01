/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/raman-sqcH2q7lkvo-unsplash.jpg')",
      },
    },
  },
  plugins: [],
}

