import { Fonts } from '../../fonts';

function getStyles(typescale, viewport) {
  return MicroConfig[typescale][viewport];
}

const MicroConfig = {
  VDS: {
    mobile: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: 'normal',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
    desktop: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: 'normal',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
  },
  MVP: {
    mobile: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '400',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
    desktop: {
      fontSize: 10,
      lineHeight: 12,
      fontWeight: '400',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
  },
  getStyles: getStyles,
};

export default MicroConfig;
