module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },  
  entry: [
    './index.js'
  ],
  devtool: 'inline-source-map',
  output: {
    path: __dirname + '/build',
    publicPath: '/',
    filename: 'bundle.min.js'
  }
};
