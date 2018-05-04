var gulp = require('gulp')
var pug = require('gulp-pug')
var changed = require('gulp-changed')
var handleErrors = require('./handleErrors')

gulp.task('htmlPug', function (){ //對HTML 採用PUG預處理的任務
  gulp.src(src + '/**.pug')
  .pipe(changed(webroot)) // changed需要預先知道目標位置
  .pipe(pug({
    pretty: true // 是否美化HTML
  }))
  .on('error', handleErrors)
  .pipe(gulp.dest(webroot))
})