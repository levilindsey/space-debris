import {renderableShapeFactory} from '../../../../gamex';
import {shipRenderableShapeFactory} from './src/ship-shape-config';
import {shipForwardThrusterRenderableShapeFactory} from './src/ship-forward-thruster-shape-config';

export * from './src/ship-config';
export * from './src/ship-controller';
export * from './src/ship-shape-config';

renderableShapeFactory.registerRenderableShapeFactory(shipRenderableShapeFactory);
renderableShapeFactory.registerRenderableShapeFactory(shipForwardThrusterRenderableShapeFactory);
