var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps')
var gulpif = require('gulp-if')
var changed = require('gulp-changed')
var handleErrors = require('./handleErrors')

gulp.task('cssSass', function () { // 命名一個叫做"cssSass"的任務
  gulp.src(src + cssDir + '/**.sass')
  .pipe(changed(webroot + cssDir)) // changed需要預先知道目標位置
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //防止錯誤直接結束node
  .pipe(gulpif(needMap, sourcemaps.write('./maps')))
  .on('error', handleErrors)
  .pipe(gulp.dest(webroot + cssDir)) // 把./src/ 內的sass通過 Sass() 的處裡 丟到./webroot
})