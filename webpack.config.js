module.exports = {
  entry: './src/FileUploader.js',
  target: 'node',
  output: {
    filename: 'index.js',
  },
  module: {
    loaders: [{
      test: /^.+\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015']
      }
    }]
  }
}
