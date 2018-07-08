// TODO
const appName = 'space-debris';
// const appName = 'dynamics-example';

const config = {};

config.srcPath = 'src';
config.distPath = 'dist';
config.resPath = 'res';
config.bowerPath = 'bower_components';

config.karmaConfigPath = `${__dirname}/../karma.conf.js`;

config.publicPath = config.srcPath;

config.scriptsDist = `${config.distPath}/scripts`;
config.shadersDist = `${config.distPath}/shaders`;
config.stylesDist = `${config.distPath}/styles`;
config.imageDist = `${config.distPath}/images`;
config.sourceMapsDist = '.';

config.scriptDistFileName = `${appName}.js`;
config.vendorScriptDistFileName = 'lib.js';
config.vendorStyleDistFileName = 'lib.css';

config.distGlob = `${config.distPath}/**`;

config.frontEndTestsSrc = `${config.publicPath}/**/*_test.js`;

config.indexSrc = `${config.publicPath}/index.html`;

config.scriptsSrc = [
  `${config.publicPath}/**/*.js`,
  `!${config.frontEndTestsSrc}`,
];
config.mainScriptSrc = `${config.publicPath}/${appName}/src/main.js`;
config.scriptsSrcBasePath = config.publicPath;
config.shadersSrc = `${config.publicPath}/**/*.+(frag|vert|glsl|c)`;
config.stylesPartialsSrc = `${config.publicPath}/**/_*.scss`;
config.stylesMainSrc = `${config.publicPath}/main.scss`;
config.stylesSrc = `${config.publicPath}/**/*.scss`;
config.imagesSrc = `${config.resPath}/images/**/*.+(png|jpg|gif)`;
config.mediaSrc = [`${config.resPath}/**`, `!${config.imagesSrc}`];
config.svgImagesSrc = `${config.resPath}/images/svg/*.svg`;
config.deviceIconsSrc = `${config.resPath}/images/device-icons/*`;

// TODO: these source arrays need to be manually kept up-to-date with the front-end libraries that are used in this app
config.vendorScriptsSrc = [
  `${config.bowerPath}/dat.gui/dat.gui.min.js`,
  `${config.bowerPath}/gl-matrix/dist/gl-matrix-min.js`
];
config.vendorScriptsMinSrc = [
  `${config.bowerPath}/gl-matrix/dist/gl-matrix-min.js`,
  `${config.bowerPath}/dat.gui/dat.gui.min.js`
];
config.vendorStylesSrc = [
];
config.vendorStylesMinSrc = [
];

config.allFilesForFrontEndTests = [
  `${config.scriptsDist}/${config.vendorScriptDistFileName}`,
  `${config.publicPath}/**/*.js`,
];

config.filesToExcludeInFrontEndTests = [
  `${config.publicPath}/${appName}/src/main.js`,
];

config.filesToProcessForFrontEndTests = `${config.publicPath}/**/*.js`;

config.buildTasks = [
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
config.host = 'localhost';
config.port = 8080;

export default config;
