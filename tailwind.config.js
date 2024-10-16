const colors = require('./src/ui/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        roboto: {
          light: 'Roboto-Light',
          regular: 'Roboto-Regular',
          medium: 'Roboto-Medium',
          semiBold: 'Roboto-SemiBold',
          bold: 'Roboto-Bold',
          black: 'Roboto-Black',
          blackItalic: 'Roboto-BlackItalic',
        },
        sfPro: {
          light: 'SFDISPLAYLIGHT',
          regular: 'SFDISPLAYREGULAR',
          medium: 'SFDISPLAYMEDIUM',
          bold: 'SFDISPLAYBOLD',
          semiBold: 'SFDISPLAYSEMIBOLD',
          black: 'SFDISPLAYBLACK',
        },
      },
      colors,
    },
  },
  plugins: [],
};
