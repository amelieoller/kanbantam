// ************* COLORS *************
// Variants: e.g. in dark theme - if you want to show the opposite, dark on a light surface
const baseRgbDark = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  onBackground: [255, 255, 255],
  onSurface: [255, 255, 255],
  onPrimary: [0, 0, 0],
  onSecondary: [0, 0, 0],
  onError: [0, 0, 0],
};

const emphasisOpacity = {
  high: 0.87,
  medium: 0.6,
  disabled: 0.38,
};

const darkColors = {
  // ------------ MAIN SURFACES (background, surfaces etc.) ------------
  // Background
  background: '#121212',

  // Surface
  surface: '#121212',

  // Primary (primary - 200, variant - 700)
  primary: '#BB86FC',
  primaryVariant: '#3700B3',

  // Secondary (secondary - 200, variant - 200)
  secondary: '#03DAC5',
  secondaryVariant: '#03DAC5',

  // Error
  error: '#CF6679',

  // ------------ "ON" COLORS (text, icon color etc.) ------------
  // On background
  onBackground: `rgba(${baseRgbDark.white}, ${emphasisOpacity.high})`,

  // On Surface
  onSurface: `rgba(${baseRgbDark.white}, ${emphasisOpacity.high})`,

  // On Primary
  onPrimary: `rgba(${baseRgbDark.black}, ${emphasisOpacity.high})`,

  // On Secondary
  onSecondary: `rgba(${baseRgbDark.black}, ${emphasisOpacity.high})`,

  // On Error
  onError: `rgba(${baseRgbDark.black}, ${emphasisOpacity.high})`,

  // ------------ Text Emphasis ------------
  medium: (color) => {
    return `rgba(${baseRgbDark[color]}, ${emphasisOpacity.medium})`;
  },

  disabled: (color) => {
    return `rgba(${baseRgbDark[color]}, ${emphasisOpacity.disabled})`;
  },

  // ------------ EXTRAS ------------
  borderColor: '#dadada',
};

const baseRgbLight = {
  black: [0, 0, 0],
  white: [255, 255, 255],
  onBackground: [0, 0, 0],
  onSurface: [0, 0, 0],
  onPrimary: [255, 255, 255],
  onSecondary: [0, 0, 0],
  onError: [255, 255, 255],
};

const lightColors = {
  // ------------ MAIN SURFACES (background, surfaces etc.) ------------
  // Background
  background: '#FFFFFF',

  // Surface
  surface: '#FFFFFF',

  // Primary (primary - 500, variant - 700)
  primary: '#6200EE',
  primaryVariant: '#3700B3',

  // Secondary (secondary - 200, variant - 900)
  secondary: '#03DAC6',
  secondaryVariant: '#018786',

  // Error
  error: '#B00020',

  // ------------ "ON" COLORS (text, icon color etc.) ------------
  // On background
  onBackground: `rgba(${baseRgbLight.black}, ${emphasisOpacity.high})`,

  // On Surface
  onSurface: `rgba(${baseRgbLight.black}, ${emphasisOpacity.high})`,

  // On Primary
  onPrimary: `rgba(${baseRgbLight.white}, ${emphasisOpacity.high})`,

  // On Secondary
  onSecondary: `rgba(${baseRgbLight.black}, ${emphasisOpacity.high})`,

  // On Error
  onError: `rgba(${baseRgbLight.white}, ${emphasisOpacity.high})`,

  // ------------ Text Emphasis ------------
  medium: (color) => {
    return `rgba(${baseRgbLight[color]}, ${emphasisOpacity.medium})`;
  },

  disabled: (color) => {
    return `rgba(${baseRgbLight[color]}, ${emphasisOpacity.disabled})`;
  },

  // ------------ EXTRAS ------------
  borderColor: '#dadada',
};

// ************* SHADOWS *************
const shadows = {
  one:
    'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px',
  two:
    'rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px',
  three:
    'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
  button:
    '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
  buttonActive:
    '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
};

// ************* SIZES *************
const sizes = {
  borderRadius: '5px',
  padding: '10px',
  paddingLarge: '15px',
  paddingInput: '8px 12px',
  listWidth: '300px',
  navbarHeight: '40px',
  sidebarWidthLarge: '250px',
  sidebarWidthSmall: '50px',
};

const media = {
  desktop: `(max-width: 992px)`,
  tablet: `(max-width: 768px)`,
  tabletSmall: `(max-width: 600px)`,
  phone: `(max-width: 480px)`,
  phoneSmall: `(max-width: 376px)`,
};

// ************* EXPORTS *************
const light = { colors: lightColors, shadows, sizes, media };
const dark = { colors: darkColors, shadows, sizes, media };

export { light, dark };
