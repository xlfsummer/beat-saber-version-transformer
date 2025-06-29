module.exports = {
  publicPath: '.',
  /** @param {import('webpack-chain')} config */
  chainWebpack: config => {
    if (process.env.NODE_ENV == "production") return;
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .tap(options => {
        options.fix = true;
        return options;
      });
  },
};
