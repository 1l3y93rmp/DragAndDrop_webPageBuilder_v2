var gulp = require('gulp')
var standard = require('gulp-standard') // JS小老師
var changed = require('gulp-changed')

gulp.task('standard', function () {
  gulp.src([
    src + jsDir + '**/*.js',
    src + jsDir + '**/*.jsx'
  ])
  .pipe(standard())
  .pipe(standard.reporter('default', {
    breakOnError: false,
    quiet: true
  }))
})