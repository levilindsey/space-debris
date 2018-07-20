import gulp from 'gulp';
import config from './config';

gulp.task('watch', config.buildTasks, () => {
  gulp.watch(config.scriptsSrc, ['scripts']);
  gulp.watch(config.shadersSrc, ['shaders']);
  gulp.watch(config.stylesSrc, ['styles']);
  gulp.watch([config.indexSrc, config.svgImagesSrc], ['index']);
  gulp.watch(config.vendorScriptsSrc, ['vendor-scripts']);
  gulp.watch(config.vendorStylesSrc, ['vendor-styles']);
  gulp.watch(config.mediaSrc, ['copy-media']);
  gulp.watch(config.deviceIconsSrc, ['copy-device-icons']);
});
