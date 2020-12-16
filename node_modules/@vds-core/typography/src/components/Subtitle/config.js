import { Fonts } from '../../fonts';

function getStyles(typescale, viewport) {
  return SubtitleConfig[typescale][viewport];
}

const SubtitleConfig = {
  VDS: {
    mobile: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: 'normal',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
    desktop: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: 'normal',
      fontFamily: Fonts.NeueHaasGroteskText,
    },
  },
  MVP: {
    mobile: {
      fontSize: 16,
      lineHeight: 19.2,
      fontWeight: '400', // 55 Roman replacement
      fontFamily: Fonts.NeueHaasGroteskDisplay,
    },
    desktop: {
      fontSize: 20,
      lineHeight: 24,
      fontWeight: '400', // 55 Roman replacement
      fontFamily: Fonts.NeueHaasGroteskDisplay,
    },
  },
  Marketing: {
    mobile: {
      fontSize: 16,
      lineHeight: 16,
      fontWeight: '400', // 55 Roman replacement
      fontFamily: Fonts.NeueHaasGroteskDisplay,
    },
    desktop: {
      fontSize: 20,
      lineHeight: 20,
      fontWeight: '400', // 55 Roman replacement
      fontFamily: Fonts.NeueHaasGroteskDisplay,
    },
  },
  getStyles: getStyles,
};

export default SubtitleConfig;
