import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('index', () => {
  return gulp.src(config.indexSrc)
    .pipe(plugins.plumber())

    // Template with Lo-dash
    .pipe(plugins.template({}))

    .pipe(gulp.dest(config.distPath));
});
