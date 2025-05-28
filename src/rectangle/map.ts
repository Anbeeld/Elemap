import { AbstractGridMap, GridMapSnapshot } from "../map.js";
import { RectangleGrid, RectangleGridSnapshot } from "./grid.js";

import { GridMapStyleSchema, modifyGridMapStyleSchema } from '../style/schema.js';
import RectangleMapStyle from "../style/rectangle/map.js";
import { Config } from "../config.js";
import { MapType } from "../utils.js";

type RectangleMapSnapshot = Omit<GridMapSnapshot, 'grid'> & {
  grid: RectangleGridSnapshot
};

export default class RectangleMap extends AbstractGridMap<RectangleGrid> {
  constructor(config: Config, style: GridMapStyleSchema) {
    super(config, style, RectangleGrid);
  }
  
  public static import(snapshot: RectangleMapSnapshot) : RectangleMap {
    return new RectangleMap({
      size: snapshot.grid.size,
      grid: {
        orientation: snapshot.grid.orientation,
        offset: snapshot.grid.offset
      }
    }, modifyGridMapStyleSchema({}));
  }
  public override export() : RectangleMapSnapshot {
    return this.exportSnapshot() as RectangleMapSnapshot;
  }
  protected override exportMapType() : string {
    return `${MapType.Rectangle}`;
  }

  protected override initStyle(style: GridMapStyleSchema) : void {
    this.style = new RectangleMapStyle(this.ids, style);
  }
}