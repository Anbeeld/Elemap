import { AbstractGridMap } from "../map.js";
import HexagonGrid from "./grid.js";
import { Config } from "../utils.js";

import { SurfaceStyleGroup } from '../style/set.js';

export default class HexagonMap extends AbstractGridMap<HexagonGrid> {
  constructor(config: Config, style: SurfaceStyleGroup) {
    super(config, style, HexagonGrid);
  }
}