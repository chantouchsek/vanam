import gulp        from 'gulp';
import runSequence from 'run-sequence';

gulp.task('dev', ['clean'], function(cb) {

  global.isProd = false;

  runSequence(['styles','vendors', 'fonts', 'views'], 'browserify', 'watch', cb);
  // runSequence(['styles','vendors', 'images', 'fonts', 'views'], 'browserify', 'watch', cb);

});
