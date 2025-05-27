import { AbstractGridMap, GridMapSnapshot } from "../map.js";
import { HexagonGrid, HexagonGridSnapshot } from "./grid.js";

import { GridMapStyleSchema, modifyGridMapStyleSchema } from '../style/schema.js';
import HexagonMapStyle from "../style/hexagon/map.js";
import { Config } from "../config.js";
import { MapType } from "../utils.js";

type HexagonMapSnapshot = GridMapSnapshot & {
  grid: HexagonGridSnapshot
};

export default class HexagonMap extends AbstractGridMap<HexagonGrid> {
  constructor(config: Config, style: GridMapStyleSchema) {
    super(config, style, HexagonGrid);
  }

  public static import(snapshot: HexagonMapSnapshot) : HexagonMap {
    return new HexagonMap({
      size: snapshot.grid.size,
      grid: {
        orientation: snapshot.grid.orientation,
        offset: snapshot.grid.offset
      }
    }, modifyGridMapStyleSchema({}));
  }

  public override export() : HexagonMapSnapshot {
    return {
      type: MapType.Hexagon,
      ids: this.ids,
      grid: this.grid.export()
    };
  }
  
  protected override initStyle(style: GridMapStyleSchema) : void {
    this.style = new HexagonMapStyle(this.ids, style);
  }
}