var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('htmlPug', function (){ //對HTML 採用PUG預處理的任務
  gulp.src(global.src + '/**.pug')
  .pipe(pug({
    pretty: true // 是否美化HTML
  }))
  .pipe(gulp.dest(global.webroot))
})