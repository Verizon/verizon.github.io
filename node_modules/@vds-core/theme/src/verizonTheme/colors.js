export const baseColors = {
  // Color Definitions
  black: '#000000',
  white: '#ffffff',
  red: '#d52b1e',
  charcoal: '#454545',
  green: '#00ac3e',
  blue: '#0088ce',
  yellow: '#ffbc3d',
  orange: '#ed7000',
  coolGray1: '#f6f6f6',
  coolGray3: '#d8dada',
  coolGray6: '#747676',
  coolGray10: '#333333',
  grayLight: '#d8dada',
};

const textColors = {
  textColor: baseColors.charcoal,
  textColorSuccess: baseColors.white,
  textColorInfo: baseColors.white,
  textColorWarning: baseColors.charcoal,
  textColorError: baseColors.white,
};

export default {
  ...baseColors,
  ...textColors,
};
