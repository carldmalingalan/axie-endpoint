const path = require("path");
const dotenv = require("dotenv");
const nodeExternals = require("webpack-node-externals");
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "src"),
  devtool: "source-map",
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  entry: ["regenerator-runtime/runtime.js", "./server.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({ "process.env": JSON.stringify(dotenv.config().parsed) }),
  ],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src/"),
      "@common": path.resolve(__dirname, "src/common/"),
      "@components": path.resolve(__dirname, "src/components/"),
    },
  },
};
