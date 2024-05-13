/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {

        mainColor: '#1d2ff5',
        lightColor:'#5663f5'
      },
     fontFamily: {
        'poppins': ['Poppins']
      },
    },
  },
  plugins: [],
};
