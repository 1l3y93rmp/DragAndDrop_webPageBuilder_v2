var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync');
var requireDir = require('require-dir'); // 此套件會協助去找任務JS


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




/*
gulp.task('JSuglify', function () { // 命名一個叫做"JSuglify"的任務
  gulp.src(global.src'/Scripts/**.js').pipe(uglify()).pipe(gulp.dest('./webroot/Scripts')) // 把./src/ 內的JS通過 uglify() 的處裡 丟到./webroot
})


gulp.task('copyHtml',function(){
  gulp.src(global.src'/*.html').pipe(gulp.dest('./webroot'));
  browserSync.reload()
})
*/


var env = process.env.NODE_ENV.trim() // 這是參數 由set NODE_ENV=在CDN內設定的
var config = require('./gulpconfig') // 這個檔案儲存了很多路徑


// global path
global.src = config.dir.src // 未編譯專案本身位置
global.webroot = config.dir.webroot //專案輸出與瀏覽指定位置
global.cssDir = config.dir.cssDir // CSS資料夾位置
global.jsDir = config.dir.jsDir // JS資料夾位置

if (env === 'dev'){ // 開發模式
  global.uglify = false
  global.needMap = true
  global.isWatching = true
} else if (env === 'publish') { // 發佈模式，有壓縮 (仍可編輯)
  global.uglify = true
  global.needMap = true
  global.isWatching = true
} else if (env === 'view') { // 預覽模式 (無 Watching 不可編輯)
  global.uglify = true
  global.needMap = false
  global.isWatching = false
}


gulp.task('clean:webroot', function () {
  del([
    global.webroot,
  ]);
});


gulp.task('browserSync',function () {
  browserSync({
    server: {
      baseDir: [global.webroot]
    },
    port: '1024'
  }, function(err, bs) {
    console.log(bs.options.getIn(["urls", "local"]));
  });
})

gulp.task('browserReload', function () {
  browserSync.reload()
})



gulp.task('watchToStratTask',function(){
  gulp.watch([global.src + '/Scripts/**.js'], ['browserify']) // 當檔案有動靜，重跑任務+Reload
  gulp.watch([global.src + '/**.pug'], ['htmlPug']) // 當檔案有動靜，重跑任務
  gulp.watch([global.src + '/Css/**.sass'], ['cssSass']) // 當檔案有動靜，重跑任務

  gulp.watch([global.webroot + '/**'], ['browserReload'])
})

gulp.task('default', ['htmlPug', 'cssSass', 'browserify'], function (){
  
  if (global.isWatching) {
    gulp.start(['browserSync','watchToStratTask']) //預設任務 打開偵聽與瀏覽器同步
  } else {
    gulp.start(['browserSync'])
  }
});


requireDir('./gulpTasks/', { recurse: true }); // 有了這個 Gulp 會自己到這個目錄下找任務~