module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      boxShadow: {
        inner: 'inset 0 -160px 10px rgba(0, 0, 0, 0.1)',
      },
      transitionProperty: {
        'height': 'height',
      }
    },
  },
  variants: {
    extend: {},
    scrollbar: ['rounded'],
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
