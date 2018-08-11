import gulp from 'gulp';
const plugins = require('gulp-load-plugins')({ lazy: false });
import config from './config';

// Useful for frontend-only projects
gulp.task('server', ['watch'], () => {
  return gulp.src(config.distPath)
    .pipe(plugins.webserver({
      host: config.host,
      port: config.port,
      fallback: 'index.html',
      livereload: {
        enable: true,
        port: 35728
      },
      open: true
    }));
});
