const config = {
  entry: {
    app: './src/site/index.tsx',
  },
  disableCSSModules: true,
  plugins: [
    ['epig-plugin-admin', {
      noAutoEntry: true,
    }],
  ],
};

module.exports = config;
