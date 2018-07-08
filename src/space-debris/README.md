# space-debris

#### Fly through starscapes destroying space debris!

_See this running at [levi.codes/space-debris][demo]!_

This game is built on [gamex][gamex], a custom 3D WebGL-based game engine.

TODO: Add some sort of getting set up and understanding the code docs.

## Notable Features

- An algorithm for calculating intercept velocity of B given the position and velocity of A and the
  position and speed of B.
- Coordination between multiple WebGL programs.
- Procedurally generated asteroid shapes.
- A procedurally generated starscape.
- A user-controllable ship flying through space and shooting asteroids!
- Rendering lat-long spherical textures over tessellated icosahera.
- A post-processing bloom shader.

## Acknowledgements / Technology Stack

The technologies used in this application include:

- [ES2015][es2015]
- [WebGL][webgl]
- [gulp.js][gulp]
- [Babel][babel]
- [Browserify][browserify]
- [SASS][sass]
- [gamex][gamex]
- [lsl-gulp-tasks][lsl-gulp-tasks]
- Numerous other packages that are available via [NPM][npm] (these are listed within the
  [`package.json`](./package.json) file)
- Numerous other packages that are available via [Bower][bower] (these are listed within the
  [`bower.json`](./bower.json) file)

The asteroid textures used in this application were obtained from [jpl.nasa.gov][jpl], courtesy
NASA/JPL-Caltech.

The ship textures were obtained from [http://webtreats.mysitemyway.com/][webtreats] and
[premiumpixels.com][premiumpixels].

## License

MIT

[demo]: http://levi.codes/space-debris

[gamex]: https://github.com/levilindsey/gamex
[lsl-gulp-tasks]: https://github.com/levilindsey/lsl-gulp-tasks

[es2015]: http://www.ecma-international.org/ecma-262/6.0/
[webgl]: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API
[node]: http://nodejs.org/
[babel]: https://babeljs.io/
[browserify]: http://browserify.org/
[gulp]: http://gulpjs.com/
[sass]: http://sass-lang.com/
[jasmine]: http://jasmine.github.io/
[karma]: https://karma-runner.github.io/1.0/index.html
[npm]: http://npmjs.org/
[bower]: http://bower.io/

[jpl]: http://www.jpl.nasa.gov/spaceimages/search_grid.php?sort=mission&q=voyager
[webtreats]: http://webtreats.mysitemyway.com/8-tileable-metal-textures/
