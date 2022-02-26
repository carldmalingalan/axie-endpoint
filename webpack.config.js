const path = require("path");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");

module.exports = {
  mode: "development",
  context: path.resolve(__dirname, "src"),
  devtool: "source-map",
  entry: "./server.js",
  externals: [nodeExternals()],
  externalsPresets: {
    node: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  module: {
    rules: [
      { test: /.(js)$/, exclude: /node_modules/, loader: "babel-loader" },
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
