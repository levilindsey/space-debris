import gulp from 'gulp';
import config from '../../../lsl-gulp-config';
import {Server} from 'karma';

gulp.task('tdd', done => {
  new Server({
    configFile: config.karmaConfigPath
  }, done).start();
});
