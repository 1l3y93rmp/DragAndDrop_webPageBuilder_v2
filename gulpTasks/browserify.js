var gulp = require('gulp')
var uglify = require('gulp-uglify')
var watchify = require('watchify')
var browserify = require('browserify')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var sourcemaps = require('gulp-sourcemaps')
var assign = require('lodash.assign')
var handleErrors = require('./handleErrors')
var gulpif = require('gulp-if')
var babelify = require('babelify')



gulp.task('browserify', function(){
  var customOpts = {
    entries: [src + jsDir + 'common.js'], // 之於HTML調用的JS入口
    debug: true
  };

  var opts = assign({}, watchify.args, customOpts);

  var b = watchify(browserify(opts))

  return b
  .transform(babelify, {presets: ['es2015', 'react']}) // 這裡不是使用 GULP流的 babel
  .bundle()
  .on('error', handleErrors)
  .pipe(source('common.js'))
  // 要有這個 source 就可以把 Node 流 轉成 Gulp 流 這裡寫輸出檔名
  .pipe(buffer()) //要有這個buffer任務再前面才可以接其他 pipe 任務
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(gulpif(uglify, uglify()))
  .pipe(gulpif(needMap, sourcemaps.write('./maps')))
  .pipe(gulp.dest(webroot + jsDir)) // 輸出位置
  // 通常 browserify抓過檔案後 還需要經過 轉譯ES6 / 產生 sourcemaps / 醜化
  // 可以把這三件事情都寫在 browserify 任務裡面
  // 使這個任務專門跑 JS
})

