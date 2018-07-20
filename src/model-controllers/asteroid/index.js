import {renderableShapeFactory} from 'gamex';
import {asteroidRenderableShapeFactory} from './src/asteroid-shape-config';

export * from './src/asteroid-controller';
export * from './src/asteroid-shape-config';
export * from './src/asteroids-config';
export * from './src/asteroids-controller';

renderableShapeFactory.registerRenderableShapeFactory(asteroidRenderableShapeFactory);
