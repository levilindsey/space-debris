import gulp from 'gulp';
import config from '../../../lsl-gulp-config';
import {Server} from 'karma';

gulp.task('test', config.buildTasks, done => {
  new Server({
    configFile: config.karmaConfigPath,
    singleRun: true
  }, done).start();
});
