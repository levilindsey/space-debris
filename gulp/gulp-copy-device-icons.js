import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('copy-device-icons', () => {
  return gulp.src(config.deviceIconsSrc)
    .pipe(plugins.plumber())
    .pipe(gulp.dest(config.distPath));
});
