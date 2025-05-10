import { GridMapStyle } from "../map.js";
import { GridStyleSchema } from "../schema.js";
import RectangleGridStyle from "./grid.js";

export default class RectangleMapStyle extends GridMapStyle {
  protected override initGrid(decls: GridStyleSchema) : void {
    this.grid = new RectangleGridStyle(this.owner.grid.ids, this.ids, decls);
  }
}