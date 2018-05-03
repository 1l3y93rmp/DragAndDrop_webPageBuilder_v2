var gulp = require('gulp')
var babel = require('gulp-babel')
var uglify = require('gulp-uglify')

var requireDir = require('require-dir'); // 此套件會協助去找任務JS
gulp.task('babel_uglify', function () {
  return gulp.src([
    './src/Scripts/**.js'
  ])
  .pipe(babel({presets: ['es2015', 'react']}))
  .pipe(uglify())
  .pipe(gulp.dest('./webroot/Scripts'))


})
