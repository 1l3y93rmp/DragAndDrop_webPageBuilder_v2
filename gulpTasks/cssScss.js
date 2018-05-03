var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps')
var gulpif = require('gulp-if')

gulp.task('cssSass', function () { // 命名一個叫做"cssSass"的任務
  gulp.src(global.src + cssDir + '/**.sass')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //防止錯誤直接結束node
  .pipe(gulpif(global.needMap, sourcemaps.write('./maps')))
  .pipe(gulp.dest(global.webroot + global.cssDir)) // 把./src/ 內的sass通過 Sass() 的處裡 丟到./webroot
})