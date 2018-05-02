var gulp = require('gulp');
var uglify = require('gulp-uglify');

gulp.task('jsUglify', function () { // 命名一個叫做"JSuglify"的任務
  gulp.src('./src/Scripts/**.js').pipe(uglify()).pipe(gulp.dest('./webroot/Scripts')) // 把./src/ 內的JS通過 uglify() 的處裡 丟到./webroot
})