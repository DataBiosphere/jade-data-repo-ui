const rewireReactHotLoader = require('react-app-rewire-hot-loader');

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);

  // To work around https://github.com/webpack/webpack/issues/11467
  // See https://egghead.io/lessons/react-customize-create-react-app-cra-without-ejecting-using-react-app-rewired for a great tutorial on configuring webpack
  let loaders = config.module.rules[1].oneOf;
  loaders.splice(loaders.length - 1, 0, {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  return config;
};
