var gulp = require('gulp');

// 输出
// gulp.src('**/**.**') // 這樣就可以把各式檔案輸出

// 來設定流水線任務
// gulp.task('任務名稱', Function(){...}) 
// gulp.task('任務名稱', ['這裡', '可以', '放其他任務名稱', '它們會在這個任務之前被先跑'], function() {...})



// default 這個任務是必備的 Gulp一進來就會跑這個預設任務，如果找不到default Gulp會發生錯誤喔~~
// 基本上大部分的任務都會撘上 default被執行的順風車 一啟用就會被調用到了
// gulp.start('任務名稱') 如果任務想要自己跑的話 這樣就會跑了

gulp.task('AA',  function () {
  console.log('AA任務跑了喔')
})

gulp.task('BB',  function () {
  console.log('BB任務跑了喔')
})


var del = require('del');

gulp.task('clean:img', function () {
  del([
    'img/*.jpg',
  ]);
});

gulp.task('default', ['clean:img', 'AA'], function (){
  
});