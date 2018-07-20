import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('copy-media', () => {
  return gulp.src(config.mediaSrc)
    .pipe(plugins.plumber())
    .pipe(gulp.dest(config.distPath));
});
