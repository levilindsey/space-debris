import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('vendor-styles', () => {
  return gulp.src(config.vendorStylesSrc)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(config.vendorStyleDistFileName))
    .pipe(gulp.dest(config.stylesDist));
});
