import TileStyle from '../tile.js';
import HexagonGridStyle from './grid.js';
import { calc } from '../utils.js';
import { getCoordsCol } from '../../utils.js';

export default class HexagonTileStyle extends TileStyle {
  public override get outerPosition() : string {
    let css = ``;
    // Outer elements use absolute positioning
    for (let row of this.owner.grid.tiles.values) {
      for (let tile of row.values) {
        css +=
        this.selectors.tile + tile.selectors.data + `{` +
          `left:${calc.sub(calc.mult(this.size.outer.width, getCoordsCol(tile.orthogonalCoords) - this.owner.grid.extremes.x.min), calc.mult((this.grid as HexagonGridStyle).tileRecess.horizontal, getCoordsCol(tile.orthogonalCoords) - this.owner.grid.extremes.x.min))};` +
        `}`; 
      }
    }
    return css;
  }
}