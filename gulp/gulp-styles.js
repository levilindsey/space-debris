import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

gulp.task('styles', () => {
  return plugins.rubySass(config.stylesMainSrc, { style: 'expanded' })
    .on('error', handleError)
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.write(config.sourceMapsDist))
    .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest(config.stylesDist))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest(config.stylesDist));
});

function handleError(error) {
  console.error('SASS error', error);
  throw error;
}
