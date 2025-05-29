import { AbstractGridMap, GridMapArguments, GridMapSnapshot } from "../map.js";
import { RectangleGrid, RectangleGridSnapshot } from "./grid.js";

import { GridMapStyleSchema } from '../style/schema.js';
import RectangleMapStyle from "../style/rectangle/map.js";
import { MapType } from "../utils.js";

type RectangleMapSnapshot = Omit<GridMapSnapshot, 'grid'> & {
  grid: RectangleGridSnapshot
};

export default class RectangleMap extends AbstractGridMap<RectangleGrid> {
  constructor(args: GridMapArguments) {
    super(args, RectangleGrid);
  }
  
  public static import(snapshot: RectangleMapSnapshot) : RectangleMap {
    return this.importSnapshot(RectangleMap, snapshot);
  }
  public override export() : RectangleMapSnapshot {
    return this.exportSnapshot() as RectangleMapSnapshot;
  }
  protected override exportMapType() : string {
    return `${MapType.Rectangle}`;
  }

  protected override initStyle(schema: GridMapStyleSchema) : void {
    this.style = new RectangleMapStyle(this.ids, schema);
  }
}