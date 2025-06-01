import { GridMapArguments } from "./map.js";
import { mangleGridIds, mangleGridMapStyleSchema, mangleGridStyleSchema, mangleMapIds, mangleProperty } from "./mangle.js";
import { modifyGridMapStyleSchema } from "./style/schema.js";
import { GridOrientation, GridOffset, DeepPartial } from "./utils.js";

export type Config = DeepPartial<GridMapArguments>;

export function configToGridMapArguments(config: Config) : GridMapArguments {
  let configSize = mangleProperty(config, 'size'),
      configGrid = mangleProperty(config, 'grid');
  return {
    ids: mangleMapIds(mangleProperty(config, 'ids')),
    grid: {
      ids: mangleGridIds(mangleProperty(configGrid, 'ids')),
      size: {
        width: mangleProperty(configSize, 'width') || 32,
        height: mangleProperty(configSize, 'height') || 18
      },
      orientation: mangleProperty(configGrid, 'orientation') || GridOrientation.Pointy,
      offset: mangleProperty(configGrid, 'offset') || GridOffset.Odd,
      schema: mangleGridStyleSchema(mangleProperty(configGrid, 'schema')),
      tiles: mangleProperty(configGrid, 'tiles')
    },
    schema: modifyGridMapStyleSchema(mangleGridMapStyleSchema(mangleProperty(config, 'schema')) || {})
  };
}