let TypographyConfig = {
  typescale: 'MVP',
};

let typeScales = ['VDS', 'MVP', 'Marketing'];

function settypescale(config) {
  if (!typeScales.includes(config)) return;
  TypographyConfig.typescale = config;
}

function getTypescale(path) {
  return TypographyConfig.typescale;
}

export default {
  getTypescale: getTypescale,
  settypescale: settypescale,
};
