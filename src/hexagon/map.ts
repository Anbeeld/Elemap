import { AbstractGridMap } from "../map.js";
import HexagonGrid from "./grid.js";

import { GridMapStyleSchema } from '../style/schema.js';
import HexagonMapStyle from "../style/hexagon/map.js";
import { Config } from "../config.js";

export default class HexagonMap extends AbstractGridMap<HexagonGrid> {
  constructor(config: Config, style: GridMapStyleSchema) {
    super(config, style, HexagonGrid);
  }
  
    protected override initStyle(style: GridMapStyleSchema) : void {
      this.style = new HexagonMapStyle(this.ids, style);
    }
}