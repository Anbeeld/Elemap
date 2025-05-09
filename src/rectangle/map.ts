import { AbstractGridMap } from "../map.js";
import RectangleGrid from "./grid.js";
// import RectangleTile from "./tile.js";
import { Config } from "../utils.js";
import RectangleGridStyle from "../style/rectangle/grid.js";

import { StyleDecls } from '../style/set.js';
import { GridMapStyle } from "../style/map.js";

export default class RectangleMap extends AbstractGridMap<RectangleGrid> {
  constructor(config: Config, style: StyleDecls) {
    super(config, style, RectangleGrid);
  }

  protected override initStyle(style: StyleDecls) : void {
    this.style = new GridMapStyle(this.ids, style, RectangleGridStyle);
  }
}