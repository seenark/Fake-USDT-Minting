/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",],
  theme: {
    extend: {
      screens: {
        iphone: "390px",
        ipad: "820px",
        desktop: "1080px"
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
  darkMode: "class"
}
