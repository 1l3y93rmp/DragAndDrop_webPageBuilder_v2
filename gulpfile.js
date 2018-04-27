var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');

// 输出&輸出
// gulp.src('**/**.**') // 這樣就可以把各式檔案輸入進來
// gulp.src('輸入的某些東西').pipe(對這些東西做些什麼~).pipe(gulp.dest('把東西輸出到另個地方~'))

// 監視檔案動靜
//gulp.watch(['監視檔案路徑','監視檔案路徑'], ['要執行的任務名稱'])


// 來設定流水線任務
// gulp.task('任務名稱', Function(){...}) 
// gulp.task('任務名稱', ['這裡', '可以', '放其他任務名稱', '它們會在這個任務之前被先跑'], function() {...})



// default 這個任務是必備的 Gulp一進來就會跑這個預設任務，如果找不到default Gulp會發生錯誤喔~~
// 基本上大部分的任務都會撘上 default被執行的順風車 一啟用就會被調用到了
// gulp.start('任務名稱') 如果任務想要自己跑的話 這樣就會跑了






gulp.task('clean:img', function () {
  /*del([
    'img/*.jpg',
  ]);*/
});

gulp.task('JSuglify', function () { // 命名一個叫做"JSuglify"的任務
  gulp.src('./src/Scripts/**.js').pipe(uglify()).pipe(gulp.dest('./webroot/Scripts')) // 把./src/ 內的JS通過 uglify() 的處裡 丟到./webroot
})

gulp.task('browserSync',function () {
  browserSync({
    server: {
      baseDir: ['./webroot']
    },
    port: '1024'
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });
})



gulp.task('default', ['browserSync'], function (){
  gulp.start('JSuglify')
  gulp.watch(['./src/Scripts/**.js'], ['JSuglify']) // 當檔案有動靜，重跑任務
});