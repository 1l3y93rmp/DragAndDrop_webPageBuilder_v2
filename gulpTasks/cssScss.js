var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('cssSass', function () { // 命名一個叫做"cssSass"的任務
  gulp.src('./src/Css/**.sass').pipe(
    sass().on('error', sass.logError) //防止錯誤直接結束node
  ).pipe(
    gulp.dest('./webroot/Css')
  ) // 把./src/ 內的sass通過 Sass() 的處裡 丟到./webroot
})