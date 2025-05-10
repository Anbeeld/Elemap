import { GridMapStyle } from "../map.js";
import { GridMapStyleSchema } from "../schema.js";
import RectangleGridStyle from "./grid.js";

export default class RectangleMapStyle extends GridMapStyle {
  protected override initGrid(decls: GridMapStyleSchema) : void {
    this.grid = new RectangleGridStyle(this.owner.grid.ids, this.ids, decls);
  }
}