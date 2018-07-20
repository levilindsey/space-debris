import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('compress-images', () => {
  return gulp.src(config.imagesSrc)
    .pipe(plugins.plumber())
    //.pipe(plugins.cache(plugins.imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))// TODO: this was causing an error; need to fix it, and uncomment it
    .pipe(gulp.dest(config.imageDist));
});
