// TODO
const appName = 'space-debris';
// const appName = 'dynamics-example';

const lslGulpConfig = {};

lslGulpConfig.srcPath = 'src';
lslGulpConfig.distPath = 'dist';
lslGulpConfig.resPath = 'res';
lslGulpConfig.nodeModulesPath = 'node_modules';

lslGulpConfig.karmaConfigPath = `${__dirname}/../karma.conf.js`;

lslGulpConfig.publicPath = lslGulpConfig.srcPath;

lslGulpConfig.scriptsDist = `${lslGulpConfig.distPath}/scripts`;
lslGulpConfig.shadersDist = `${lslGulpConfig.distPath}/shaders`;
lslGulpConfig.stylesDist = `${lslGulpConfig.distPath}/styles`;
lslGulpConfig.imageDist = `${lslGulpConfig.distPath}/images`;
lslGulpConfig.sourceMapsDist = '.';

lslGulpConfig.scriptDistFileName = `${appName}.js`;
lslGulpConfig.vendorScriptDistFileName = 'lib.js';
lslGulpConfig.vendorStyleDistFileName = 'lib.css';

lslGulpConfig.distGlob = `${lslGulpConfig.distPath}/**`;

lslGulpConfig.frontEndTestsSrc = `${lslGulpConfig.publicPath}/**/*_test.js`;

lslGulpConfig.indexSrc = `${lslGulpConfig.publicPath}/index.html`;

lslGulpConfig.scriptsSrc = [
  `${lslGulpConfig.publicPath}/**/*.js`,
  `!${lslGulpConfig.frontEndTestsSrc}`,
];
lslGulpConfig.mainScriptSrc = `${lslGulpConfig.publicPath}/${appName}/src/main.js`;
lslGulpConfig.scriptsSrcBasePath = lslGulpConfig.publicPath;
lslGulpConfig.shadersSrc = `${lslGulpConfig.publicPath}/**/*.+(frag|vert|glsl|c)`;
lslGulpConfig.stylesPartialsSrc = `${lslGulpConfig.publicPath}/**/_*.scss`;
lslGulpConfig.stylesMainSrc = `${lslGulpConfig.publicPath}/main.scss`;
lslGulpConfig.stylesSrc = `${lslGulpConfig.publicPath}/**/*.scss`;
lslGulpConfig.imagesSrc = `${lslGulpConfig.resPath}/images/**/*.+(png|jpg|gif)`;
lslGulpConfig.mediaSrc = [`${lslGulpConfig.resPath}/**`, `!${lslGulpConfig.imagesSrc}`];
lslGulpConfig.svgImagesSrc = `${lslGulpConfig.resPath}/images/svg/*.svg`;
lslGulpConfig.deviceIconsSrc = `${lslGulpConfig.resPath}/images/device-icons/*`;

// TODO: these source arrays need to be manually kept up-to-date with the front-end libraries that are used in this app
lslGulpConfig.vendorScriptsSrc = [
  `${lslGulpConfig.nodeModulesPath}/dat.gui/build/dat.gui.min.js`,
  `${lslGulpConfig.nodeModulesPath}/gl-matrix/dist/gl-matrix-min.js`
];
lslGulpConfig.vendorScriptsMinSrc = [
  `${lslGulpConfig.nodeModulesPath}/gl-matrix/dist/gl-matrix-min.js`,
  `${lslGulpConfig.nodeModulesPath}/dat.gui/build/dat.gui.min.js`
];
lslGulpConfig.vendorStylesSrc = [
];
lslGulpConfig.vendorStylesMinSrc = [
];

lslGulpConfig.allFilesForFrontEndTests = [
  `${lslGulpConfig.scriptsDist}/${lslGulpConfig.vendorScriptDistFileName}`,
  `${lslGulpConfig.publicPath}/**/*.js`,
];

lslGulpConfig.filesToExcludeInFrontEndTests = [
  `${lslGulpConfig.publicPath}/${appName}/src/main.js`,
];

lslGulpConfig.filesToProcessForFrontEndTests = `${lslGulpConfig.publicPath}/**/*.js`;

lslGulpConfig.buildTasks = [
  'scripts',
  'shaders',
  'styles',
  'vendor-scripts',
  'vendor-styles',
  'index',
  'copy-media',
  'copy-device-icons',
  'compress-images'
];

//config.host = '0.0.0.0';
lslGulpConfig.host = 'localhost';
lslGulpConfig.port = 8080;

export default lslGulpConfig;
