const gulp = require('gulp')
// const babel = require('gulp-babel')
const plumber = require('gulp-plumber')
const uglify = require('gulp-uglify')
const webpack = require('webpack-stream')
const webpack_config = require('./webpack.config.js')

gulp.task('transpile', function() {
  return gulp.src("./src/**/*.js")
    .pipe(plumber())
    .pipe(webpack(webpack_config))
    .pipe(uglify().on('error', console.log))
    .pipe(gulp.dest("./dist"))
})

gulp.task('build', [ 'transpile' ])
