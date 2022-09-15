/** @type {import('tailwindcss').Config}  767*/
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'Inter': 'Inter, sans-serif',
        'Poppins': 'Poppins, sans-serif'
      },
    },
    screens: {
      '2sm': {'max':'767px'} 
    },
  },
  plugins: [],
}
