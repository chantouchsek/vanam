'use strict';

import config from '../config';
import gulp   from 'gulp';

gulp.task('vendors', function() {
  return gulp.src([config.vendors.src])
    .pipe(gulp.dest(config.vendors.dest));
});
