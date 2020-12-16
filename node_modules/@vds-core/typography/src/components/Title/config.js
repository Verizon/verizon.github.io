import { Fonts } from '../../fonts';

function getStyles(typescale, viewport, typeSize) {
  return TitleConfig[typescale][viewport][typeSize];
}

const TitleConfig = {
  VDS: {
    mobile: {
      extraExtraLarge: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraLarge: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      large: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 20,
        lineHeight: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 16,
        lineHeight: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraSmall: {
        fontSize: 12,
        lineHeight: 11,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
    desktop: {
      extraExtraLarge: {
        fontSize: 64,
        lineHeight: 64,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraLarge: {
        fontSize: 48,
        lineHeight: 48,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      large: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 20,
        lineHeight: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraSmall: {
        fontSize: 14,
        lineHeight: 14.5,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
  },
  MVP: {
    mobile: {
      extraExtraLarge: {
        fontSize: 34,
        lineHeight: 32.3,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      extraLarge: {
        fontSize: 34,
        lineHeight: 32.3,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      large: {
        fontSize: 25,
        lineHeight: 24,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      medium: {
        fontSize: 16,
        lineHeight: 15,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      small: {
        fontSize: 16,
        lineHeight: 15,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      extraSmall: {
        fontSize: 12,
        lineHeight: 11,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
    },
    desktop: {
      extraExtraLarge: {
        fontSize: 64,
        lineHeight: 60.8,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      extraLarge: {
        fontSize: 44,
        lineHeight: 41.8,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      large: {
        fontSize: 32,
        lineHeight: 30.4,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      medium: {
        fontSize: 24,
        lineHeight: 22.8,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      small: {
        fontSize: 20,
        lineHeight: 19,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
      extraSmall: {
        fontSize: 14,
        lineHeight: 14.5,
        fontWeight: '750',
        fontFamily: Fonts.NeueHaasGroteskDisplay,
      },
    },
  },
  Marketing: {
    mobile: {
      extraExtraLarge: {
        fontSize: 25,
        lineHeight: 25,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraLarge: {
        fontSize: 25,
        lineHeight: 25,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      large: {
        fontSize: 25,
        lineHeight: 25,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 16,
        lineHeight: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 16,
        lineHeight: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraSmall: {
        fontSize: 12,
        lineHeight: 12,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
    },
    desktop: {
      extraExtraLarge: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraLarge: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      large: {
        fontSize: 32,
        lineHeight: 32,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      medium: {
        fontSize: 24,
        lineHeight: 24,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      small: {
        fontSize: 20,
        lineHeight: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      extraSmall: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: 'bold',
        fontFamily: Fonts.NeueHaasGroteskText,
      },
      //extraExtraLarge and extraLarge should not exist in Marketing
    },
  },
  getStyles: getStyles,
};

export default TitleConfig;
