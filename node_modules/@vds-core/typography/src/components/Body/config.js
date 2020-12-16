import { Fonts } from '../../fonts';

function getStyles(typescale, viewport, typeSize) {
  return BodyConfig[typescale][viewport][typeSize];
}

const BodyConfig = {
  VDS: {
    mobile: {
      large: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
    desktop: {
      large: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 16,
        lineHeight: 20,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
  },
  MVP: {
    mobile: {
      large: {
        fontSize: 12,
        lineHeight: 14.4,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 12,
        lineHeight: 14.4,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 12,
        lineHeight: 14.4,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
    desktop: {
      large: {
        fontSize: 16,
        lineHeight: 19.2,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 14,
        lineHeight: 16.8,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 12,
        lineHeight: 14.4,
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
  },
  getStyles: getStyles,
};

export default BodyConfig;
