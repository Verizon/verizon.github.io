var webpack = require("webpack");
var path = require("path");
var expand = require("expand");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: "./index.js",
  output: {
    path: "./static",
    filename: "js/osshome.js"
  },
  watchOptions: {
    poll: true
  },
  module: {
    loaders: [
      {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff"},
      {test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader"},
      {test: /\.jsx?/, include : path.resolve('./src'), loader : 'babel'},
      {test: /\.css$/, loader: "style-loader!css-loader"},
      {test: /\.png$/, loader: "url-loader?limit=100000" },
      {test: /\.jpg$/, loader: "file-loader"},
    ]
  },
  plugins: [
    // $importantNote uncomment before pushing.  Comment during local development for faster webpack build times
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //   },
    //   mangle: false,
    //   output: {
    //     comments: false,
    //   },
    // }),
    new CopyWebpackPlugin([
      { from: 'css', to: 'css' },
      { from: 'img', to: 'img' },
      { from: 'packages', to: 'packages'} //,
      // { from: 'index.html', to: '../layouts/index.html' },
    ])
  ]
}
