import { AbstractGridMap, GridMapArguments, GridMapSnapshot } from "../map.js";
import { HexagonGrid, HexagonGridSnapshot } from "./grid.js";

import { GridMapStyleSchema } from '../style/schema.js';
import HexagonMapStyle from "../style/hexagon/map.js";
import { MapType } from "../utils.js";

type HexagonMapSnapshot = Omit<GridMapSnapshot, 'grid'> & {
  grid: HexagonGridSnapshot
};

export default class HexagonMap extends AbstractGridMap<HexagonGrid> {
  constructor(args: GridMapArguments) {
    super(args, HexagonGrid);
  }

  public static import(snapshot: HexagonMapSnapshot) : HexagonMap {
    return this.importSnapshot(HexagonMap, snapshot);
  }
  public override export() : HexagonMapSnapshot {
    return this.exportSnapshot() as HexagonMapSnapshot;
  }
  protected override exportMapType() : string {
    return `${MapType.Hexagon}`;
  }
  
  protected override initStyle(schema: GridMapStyleSchema) : void {
    this.style = new HexagonMapStyle(this.ids, schema);
  }
}