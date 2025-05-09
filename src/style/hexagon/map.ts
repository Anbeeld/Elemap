import { GridMapStyle } from "../map.js";
import { StyleDecls } from "../set.js";
import HexagonGridStyle from "./grid.js";

export default class HexagonMapStyle extends GridMapStyle {
  protected override initGrid(decls: StyleDecls) : void {
    this.grid = new HexagonGridStyle(this.owner.grid.ids, this.ids, decls);
  }
}