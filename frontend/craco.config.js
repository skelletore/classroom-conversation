const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: {
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        fallback: {
          process: require.resolve("process/browser.js"),
          zlib: require.resolve("browserify-zlib"),
          stream: require.resolve("stream-browserify"),
          util: require.resolve("util"),
          buffer: require.resolve("buffer"),
          asset: require.resolve("assert"),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser.js",
        }),
      ],
    },
  },
}