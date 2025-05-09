import { AbstractGridMap } from "../map.js";
import HexagonGrid from "./grid.js";
import { Config } from "../utils.js";

import { StyleDecls } from '../style/set.js';
import { GridMapStyle } from "../style/map.js";
import HexagonGridStyle from "../style/hexagon/grid.js";

export default class HexagonMap extends AbstractGridMap<HexagonGrid> {
  constructor(config: Config, style: StyleDecls) {
    super(config, style, HexagonGrid);
  }
  
    protected override initStyle(style: StyleDecls) : void {
      this.style = new GridMapStyle(this.ids, style, HexagonGridStyle);
    }
}