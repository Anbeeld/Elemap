import { AbstractGridMap } from "../map.js";
import RectangleGrid from "./grid.js";
// import RectangleTile from "./tile.js";

import { GridMapStyleSchema } from '../style/schema.js';
import RectangleMapStyle from "../style/rectangle/map.js";
import { Config } from "../config.js";

export default class RectangleMap extends AbstractGridMap<RectangleGrid> {
  constructor(config: Config, style: GridMapStyleSchema) {
    super(config, style, RectangleGrid);
  }

  protected override initStyle(style: GridMapStyleSchema) : void {
    this.style = new RectangleMapStyle(this.ids, style);
  }
}