import TileStyle from '../tile.js';
import HexagonGridStyle from './grid.js';
import { calc } from '../utils.js';
import { getCoordsCol } from '../../utils.js';

export default class HexagonTileStyle extends TileStyle {
  public override get outerPosition() : string {
    let css = ``;
    // Outer elements use absolute positioning
    for (let [i, row] of this.owner.grid.tiles) {
      i; // TODO
      for (let [j, tile] of row) {
        j; // TODO
        let fromLeft = getCoordsCol(tile.coords) - this.owner.grid.tilesLimits.cols.min;
        css +=
        this.selectors.outerTile + tile.selectors.data + `{` +
          `left:${calc.sub(calc.mult(this.size.outer.width, fromLeft), calc.mult((this.grid as HexagonGridStyle).tileRecess.horizontal, fromLeft))};` +
        `}`; 
      }
    }
    return css;
  }
}