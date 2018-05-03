var gulp = require('gulp')
var uglify = require('gulp-uglify')
var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var sourcemaps = require('gulp-sourcemaps')
var assign = require('lodash.assign')
var babel = require('gulp-babel')
var gulpif = require('gulp-if')

// var browserify = require('gulp-browserify')


gulp.task('browserify', function(){
  var customOpts = {
    entries: [global.src + global.jsDir + 'common.js'],
    debug: true
  };

  var opts = assign({}, watchify.args, customOpts);

  var b = watchify(browserify(opts))

  return b
  .bundle()
  .pipe(source('common.js'))
  // 要有這個 source 就可以把 Node 流 轉成 Gulp 流 這裡寫輸出檔名
  .pipe(buffer()) //要有這個buffer任務再前面才可以接其他 pipe 任務
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(babel({presets: ['es2015', 'react']}))
  .pipe(gulpif(global.uglify, uglify()))
  .pipe(gulpif(global.needMap, sourcemaps.write('./maps')))
  .pipe(gulp.dest( global.webroot + global.jsDir)) // 輸出位置
  // 通常 browserify抓過檔案後 還需要經過 轉譯ES6 / 產生 sourcemaps / 醜化
  // 可以把這三件事情都寫在 browserify 任務裡面
  // 使這個任務專門跑 JS
})


/*
gulp.task('browserify', function () {
  return gulp.src(['./src/Scripts/common.js'])
   .pipe(browserify())
   .pipe(uglify())
   .pipe(gulp.dest('./webroot/Scripts'));
});*/