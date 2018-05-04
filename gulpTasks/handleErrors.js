var notify = require('gulp-notify');

module.exports = function() {

  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  // 通過 gulp-notify 向 控制面板發送錯誤
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  // 不要讓 Gulp 停下來
  this.emit('end');
};