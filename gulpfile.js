var gulp = require('gulp');
var fs = require('fs');
var rimraf = require('rimraf');

// 清理dist文件
if (fs.existsSync('./lib')) {
  rimraf.sync('./lib', {});
}

gulp.task('copy', function() {
  gulp.src(['src/**/*', '!src/site', '!src/site/**'], { base: './src' })
  .pipe(gulp.dest('./lib'));
});

gulp.task('default', ['copy']);
