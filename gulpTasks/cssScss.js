var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps')

gulp.task('cssSass', function () { // 命名一個叫做"cssSass"的任務
  gulp.src('./src/Css/**.sass')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError)) //防止錯誤直接結束node
  .pipe(sourcemaps.write('./maps'))
  .pipe(gulp.dest('./webroot/Css')) // 把./src/ 內的sass通過 Sass() 的處裡 丟到./webroot
})