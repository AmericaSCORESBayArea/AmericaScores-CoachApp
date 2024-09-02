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
        inter: ['Inter'],
        sFDISPLAYREGULAR: ['SFDISPLAYREGULAR'],
        robotoBlackItalic: ['Roboto-BlackItalic'],
        // sfProDisplay: [
        //   'SFDISPLAYREGULAR',
        //   'SFPRODISPLAYULTRALIGHTITALIC',
        //   'SFPRODISPLAYTHINITALIC',
        //   'SFPRODISPLAYBLACKITALIC',
        //   'SFPRODISPLAYHEAVYITALIC',
        //   'SFPRODISPLAYBOLD',
        //   'SFPRODISPLAYSEMIBOLDITALIC',
        //   'SFPRODISPLAYMEDIUM',
        // ],
        // roboto: [
        //   'Roboto-BlackItalic',
        //   'Roboto-Black',
        //   'Roboto-BoldItalic',
        //   'Roboto-Bold',
        //   'Roboto-MediumItalic',
        //   'Roboto-Medium',
        //   'Roboto-Italic',
        //   'Roboto-Regular',
        //   'Roboto-LightItalic',
        //   'Roboto-Light',
        //   'Roboto-ThinItalic',
        //   'Roboto-Thin',
        // ],
      },
      colors,
    },
  },
  plugins: [],
};
