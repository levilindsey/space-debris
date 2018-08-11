# space-debris

#### Fly through starscapes destroying space debris!

_See this running at [levi.codes/space-debris][demo]!_

This is a WebGL-based space-flight simulation video game. 

To learn about the 3D WebGL-based game engine this is built on, checkout [gamex][gamex].

## Notable Features

- An algorithm for calculating intercept velocity of B given the position and velocity of A and the
  position and speed of B.
- Coordination between multiple [WebGL programs][webgl-program].
- Procedurally generated asteroid shapes.
- A procedurally generated starscape.
- A user-controllable ship flying through space and shooting asteroids!
- Rendering lat-long spherical textures over [tessellated][tesselation] icosahera.
- A post-processing [bloom][bloom] shader.
- A ton of cool features in supporting libraries--notably:
  - [grafx][grafx]: A 3D graphics framework for WebGL.
  - [physx][physx]: A physics engine with 3D rigid-body dynamics and collision detection (with
    impulse-based resolution).

## Acknowledgements / Technology Stack

The technologies used in this application include:

- [ES2015][es2015]
- [WebGL][webgl]
- [gulp.js][gulp]
- [Babel][babel]
- [Browserify][browserify]
- [SASS][sass]
- [gamex][gamex]
- Numerous other packages that are available via [NPM][npm] (these are listed within the
  [`package.json`](./package.json) file)

The asteroid textures used in this application were obtained from [jpl.nasa.gov][jpl], courtesy
NASA/JPL-Caltech.

The ship textures were obtained from [http://webtreats.mysitemyway.com/][webtreats] and
[premiumpixels.com][premiumpixels].

## Developing / Running the Code

See [Getting Set Up](./docs/getting-set-up) or [Understanding the
Code](./docs/understanding-the-code) for more info.

## License

MIT

[demo]: http://levi.codes/space-debris

[gamex]: https://github.com/levilindsey/gamex
[grafx]: https://github.com/levilindsey/grafx
[physx]: https://github.com/levilindsey/physx

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

[jpl]: http://www.jpl.nasa.gov/spaceimages/search_grid.php?sort=mission&q=voyager
[webtreats]: http://webtreats.mysitemyway.com/8-tileable-metal-textures/

[webgl-program]: https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram
[tesselation]: https://en.wikipedia.org/wiki/Tessellation
[bloom]: https://en.wikipedia.org/wiki/Bloom_(shader_effect)