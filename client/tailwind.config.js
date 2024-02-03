/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT ({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'logoFirst' : '#F4E869',
        'logoSecond' : '#3085C3',
        'details': '#14CFCF',
        'detailsFont': '#3788B0'
      },
    },
  },
  plugins: [require("daisyui"),
],
});