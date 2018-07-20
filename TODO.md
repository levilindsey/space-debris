FIXME: MAIN TODO LIST:



- Folder configs
  - MAKE SURE ALL ITEMS UPDATE IN REAL TIME (for both apps)
  - Make sure I have configs for all the things I care about:
    - camera, light, shader, texture



- Children asteroids
  - Add a new field for which tier the asteroid is (3, 2, 1).
  - Add different size/shape/#-of-sub-shapes-to-create configurations for each tier.
  - Add logic for creating (or not) children asteroids.
  - Add placeholder logic for triggering asteroid explosions.



- Limit the area that we use the bloom shader on to only the region around the ship?
  - Also, only render the bloom shader when the ship's thrusters are on
- Check performance at this point. Is any jank from needing a bvh? Or is it shader related?



- Update shaders
  - Refactor original shader to support more things like texture blending, with color blending, with
    (Blinn-Phong?) specularity/reflection, etc.
  - Hook up dat.GUI menu items for switching shaders.
    - Adding post-processing shaders.
    - Switching primary shaders.
    - Selectively changing for the different model controllers.



- Go back through READMEs and document remaining details.

- Separate out the sub-projects
  - Create a different repo for each
  - Create a new repo just for the gulp tasks that I use
    - lsl-gulp-tasks
    - Duplicate docs and top-level files in each repo
    - Do not duplicate the gulp commands
  - Create a different NPM package for each (and for the gulp commands)
  - Update the import statements to use the globally-available import paths
  - Update the package.json files and the gulpfile.babel.js files to reference the new gulp package
    in node_modules/



- Go through shaders and check if it makes much difference to use mediump instead of lowp and vice
  versa.



- Asteroid zoom-in animation
    - Add a zoom-in animation for newly created asteroids, so they don't just "appear".
    - Show a zoom animation for the asteroid suddenly flying in from a great distance to its
      "starting" position, at which point it also has its "starting" spin and velocity.
  - ACTUALLY, since the above zoom-in would happen from away from the camera, it should just appear
    as the asteroid enlarging. So this should instead just simply make the asteroid grow out from a
    very small size.



- Ship thruster animations
  - Add engine acceleration effect (blurry triangle firing outward from ship; could be 2D?)
  - Add a torpedo blasting away effect (blurry circle at the front of the ship (rendered underneath
    the ship?))
  - Add logic to fade-in/grow-in the thruster shape when it turns on



- Explosion animations
  - A new non-collidable, non-physics-based class that extends ModelController.
  - Add some super-simple explosion animation.
  - Just research simple explosion/dust/poof techniques.
  - Add an explosion when asteroids are destroyed.
  - Add an explosion when the ship is destroyed.



- Update the keys used to not be Dvorak-based



- Cross-browser/device compatibility
  - Check rendering/performance on other browsers (and mobile)
  - Add support for mobile play?
    - Use accelerometer to steer?
    - Add three buttons at the bottom of the screen for shooting, accelerating, and braking?
    - Could also add mouse support? (probably not turning if in center region, then turning if
      beyond threshold in x/y directions)
    - Update controls menu tab depending on whether its a mobile device.



- Starting zoom animation
  - Initial post-load animation to zoom the ship into place (with the screensaver effect).



- Add sound effects.
  - Look up what the current browser support is and what the current library to use is.
  - Add some ambient music/noise?
  - Add sound effects for:
    - Ship forward thruster
    - Ship rotation thrusters
    - Ship spinning out of control alert
    - Ship torpedo
    - UFO torpedo
    - Ship explosion
    - UFO explosion
    - UFO presence sound/alert
    - Asteroid proximity alert
    - Asteroid explosion
    - Asteroid-asteroid collision
    - Ship-asteroid/ship-ufo collision
    - Game start jingle
    - Game over jingle
    - Pause/unpause
  - Add logic to make asteroid proximity and UFO presence sounds louder when they are closer?



- When to show/hide dat.GUI menu? Change wording from "Open Controls" to "Adjust parameters"?
- Slide a panel explaining controls onto the screen after 0.5 seconds of inactivity.



- Add UFOs



- Add support for HDR rendering.
  - Also, make sure bloom can yield colors other than just white after
    the additive blending.



- Add counts/statistics
  - Show stats for playing
    - for current game and total cumulative plays (use local storage)
    - # of asteroids destroyed
    - # of UFOs destroyed
    - Bullets fired
    - Damage taken
  - score
    - more points for UFOs destroyed
    - more points for hitting bigger asteroids
    - more points for completely destroying all parts of an asteroids
    - slight multiplier for lower health
    - slowly gain points as time passes simply for surviving 
    - after each multiple of 10,000 points, get a health point back



----------------------------------------------------------------
### These can be implemented after releasing the app



- Refactor game controller to batch DOM UI updates, and to be triggered as a
  recurring animation job



- Implement some sort of space partitioning so that not all pairs of collidables need to be
  considered at each time step
    - sort and sweep?
    - bounding volume hierarchies?
    - octrees?
  - BVH



- Add another type(s) of shader program: Annotations:
  - Be able to render groups of dots in given colors, text labels, and line segments.
- Add the configurable ability to render a wireframe shape representing the bounding volume of a
  Collidable and to change the color (from blue to red?) when a broad-phase collision has been
  detected?



- Ship thruster polish
  - Add behavior to the ship acceleration to more quickly dampen any previous velocity that is
    against the acceleration (it takes a painfully long time to change course) (just increase linear
    drag?).



- Add a param for the shape definitions that prevents caching.
  - Use this for the capsule when we use random params and know that all capsules will be different.

- Fix the icosahedron texture seam problem.



- Refactor torpedos to be simple lines:
  - Render flat, 2D lines rather than 3D shapes
  - Still probably use bloom shading
  - Add support in collision system for line-segment collidables (they should be much more
    efficient).
  - Should also remove the inidividual torpedo controller class and just pass in the single, flat
    array to draw all torpedo line segments at the same time?



- Fix Karma tests.



- Fix `reset` methods across app. Right now, you can't really call reset to return the app to its
  starting state. Instead, we have to recreate everything. This shouldn't be the case.



- Add difraction spikes to stars?



- Accurate asteroid sub-division
  - Add a more complex explosion effect and asteroid sub-division:
  - Break apart the asteroid into realistic sub-portions of the initial complete shape.
  - Depends on how many chunks we want to split it into. Let's assume four for these descriptions.
  - We need to store a collection of neighbor vertices associated with each vertex of the original
    complete shape.
  - Additionally, we need to store the vertices of the original shape within a spatial-based data
    structure like an octree.
  - Calculate the centroid and average radius of the original shape.
  - Calculate a tetrahedron shape (for four sub-divisions) centered on the centroid and using the
    average radius.
  - Find the closest vertex from the original shape to the first corner of the tetrahedron.
  - Loop over the neighbors of the current vertex to find the closest one to the second vertex of
    the tetrahedron.
    - If needed, for greater accuracy, we can tessellate the original shape, the tetrahedron, or
      both to select better vertices during this walk.
  - After reaching the second vertex, we have found the list of vertices that will line one edge of
    the new sub-shape.
  - Repeat the above few steps to find the other edges.
  - After finding all the outer edges of a new sub-shape (corresponding to one face of the dividing
    tetrahedron), create a triangle from each edge-vertex pair to the centroid of the original
    shape.
    - Actually, calculate a position somewhat closer to the outer face than the centroid, and use
      this position (this will leave us with a rounder, less pointed resulting shape).
  - This should leave us with somewhat of a diamond shape (lots of long triangles lining the outer
    edges, pointing down to the center).
  - Tesselate each of these long triangles leading from the centroid.
  - Calculate the position centered between the centroid and the outer face.
  - Push each of these tesselated vertices slightly outward from the position that we calculated
    above (this will leave us with a rounder, less pointed resulting shape).
  - We should now have the vertices of our completed sub shape.



- Alternate game mode idea
  - Escape from gravitational pull from sun that's going super nova (with lots of asteroids in the
    way).



### Old high-level plans:
- Have rocks/ship/etc. require enough hits/damage before exploding.
- Have explosions spread out away from the point of impact and according to the direction and speed
  of the hit.
- "Space Rocks"
- Add a couple far off planets that can actually be destroyed with enough hits.
- Have ship and rocks bounce instead of exploding at low impact.



- Make sure there is documentation explaining each of the parts (classes/types of classes) of the
  physics engine, collidable pipeline, graphics framework, etc.
  - Collidable
  - PhysicsJob
  - CollidablePhysicsJob
  - RenderableShape
    - And the different presets
  - ProgramWrapper
  - Collision
  - PhysicsState
  - Latency profiler
  - Animator
  - ...

- Include disclaimers at the top of each repo's README:
  - NOTE: This project re-invents the wheel! If you are looking for a ....
  - 3D graphics library: three.js: https://github.com/mrdoob/three.js/
  - UD Physics engine: cannon.js: https://github.com/schteppe/cannon.js



- CollisionHandler: Add temporal bisection to get more specific time/state of collision.



- HOLD OFF ON OBBs!
- Do thorough debugging of the collision detection / response system:
  - Each combination of pairs of shapes.
  - Also, with different orientations, so different parts of the shapes make the impact.

- Debug the instability of long OBBs colliding.


- Finish remaining polish in the physics system.

- Finish remaining polish in the camera system.

- Use web workers!:
  - Move all physics logic to the web worker.
  - Also refactor grafx framework to support all `update` logic running on a web worker?


- Plan method for finding ball that is clicked on, and then applying a spring force from the cursor
  to that ball

- Make the camera type selectable and allow switching to a follow camera that tracks the most recent
  object.

- Do research about cloth simulations.
  - http://davis.wpi.edu/~matt/courses/cloth/
  - And maybe: www.cs.bilkent.edu.tr/~cansin/projects/cs567-animation/cloth/cloth-paper.pdf
- Do I need to make the individual triangles collidable?? (No)

- Possible collision quirks to debug/think about:
  - Debug why all bouncing objects with no drag and perfect elasticity could lose energy.
  - Debug why an object could be moving away from the collision normal.
