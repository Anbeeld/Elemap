import { GridMapStyle } from "../map.js";
import { GridMapStyleSchema } from "../schema.js";
import HexagonGridStyle from "./grid.js";

export default class HexagonMapStyle extends GridMapStyle {
  protected override initGrid(decls: GridMapStyleSchema) : void {
    this.grid = new HexagonGridStyle(this.owner.grid.ids, this.ids, decls);
  }
}