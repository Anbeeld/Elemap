import TileStyle from '../tile.js';
import HexagonGridStyle from './grid.js';
import { calc } from '../utils.js';

export default class HexagonTileStyle extends TileStyle {
  public override get outerPosition() : string {
    let css = ``;
    // Outer elements use absolute positioning
    for (let rows of this.owner.grid.tiles) {
      for (let tile of rows) {
        css +=
        this.selectors.outerTile + tile.selectors.data + `{` +
          `left:${calc.sub(calc.mult(this.size.outer.width, tile.index!.j), calc.mult((this.grid as HexagonGridStyle).tileRecess.horizontal, tile.index!.j))};` +
        `}`; 
      }
    }
    return css;
  }
}