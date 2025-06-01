import { GridMapArguments } from "./map.js";
import { mangleGridIds, mangleGridMapStyleSchema, mangleGridStyleSchema, mangleMapIds, mangleProperty } from "./mangle.js";
import { modifyGridMapStyleSchema } from "./style/schema.js";
import { GridOrientation, GridOffset, DeepPartial } from "./utils.js";

export type Config = DeepPartial<GridMapArguments>;

export function configToGridMapArguments(config: Config) : GridMapArguments {
  return {
    ids: mangleMapIds(mangleProperty(config, 'ids')),
    grid: {
      ids: mangleGridIds(mangleProperty(mangleProperty(config, 'grid'), 'ids')),
      size: {
        width: mangleProperty(mangleProperty(config, 'size'), 'width') || 32,
        height: mangleProperty(mangleProperty(config, 'size'), 'height') || 18
      },
      orientation: mangleProperty(mangleProperty(config, 'grid'), 'orientation') || GridOrientation.Pointy,
      offset: mangleProperty(mangleProperty(config, 'grid'), 'offset') || GridOffset.Odd,
      schema: mangleGridStyleSchema(mangleProperty(mangleProperty(config, 'grid'), 'schema')),
      tiles: mangleProperty(mangleProperty(config, 'grid'), 'tiles')
    },
    schema: modifyGridMapStyleSchema(mangleGridMapStyleSchema(mangleProperty(config, 'schema')) || {})
  };
}