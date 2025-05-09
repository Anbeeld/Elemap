import { GridMapStyle } from "../map.js";
import { StyleDecls } from "../set.js";
import RectangleGridStyle from "./grid.js";

export default class RectangleMapStyle extends GridMapStyle {
  protected override initGrid(decls: StyleDecls) : void {
    this.grid = new RectangleGridStyle(this.owner.grid.ids, this.ids, decls);
  }
}