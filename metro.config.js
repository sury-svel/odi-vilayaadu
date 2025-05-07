// metro.config.js
const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

module.exports = (() => {
  // Grab the router-aware defaults
  const config = getDefaultConfig(__dirname);

  // ======================
  // 1) Your node-core shims
  // ======================
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    stream:      require.resolve('stream-browserify'),
    events:      require.resolve('events'),
    http:        require.resolve('stream-http'),
    https:       require.resolve('https-browserify'),
    crypto:      require.resolve('crypto-browserify'),
    net:         require.resolve('net-browserify'),
    url:         require.resolve('url/'),
    tls:         require.resolve('tls-browserify'),
    zlib:        require.resolve('browserify-zlib'),
    assert:      require.resolve('assert/'),
    querystring: require.resolve('querystring/'),
    fs:          require.resolve('browserify-fs'),
    path:        require.resolve('path-browserify'),
  };

  // ======================
  // 2) Force all @react-navigation/* imports
  //    to resolve to the single top-level copy
  // ======================
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (moduleName.startsWith('@react-navigation/')) {
      return {
        // require.resolve finds e.g. index.native.js or index.js
        filePath: require.resolve(moduleName),
        type: 'sourceFile',
      };
    }
    // fall back to Metro’s built-in resolver
    return context.resolveRequest(context, moduleName, platform);
  };

  return config;
})();
