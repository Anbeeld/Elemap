import { AbstractGridMap } from "../map.js";
import RectangleGrid from "./grid.js";
// import RectangleTile from "./tile.js";
import { Config } from "../utils.js";

import { SurfaceStyleGroup } from '../style/set.js';

export default class RectangleMap extends AbstractGridMap<RectangleGrid> {
  constructor(config: Config, style: SurfaceStyleGroup) {
    super(config, style, RectangleGrid);
  }
}