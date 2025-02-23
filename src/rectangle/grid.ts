import { AbstractGrid } from "../grid.js";
import RectangleTile from "./tile.js";
import { Config, generateRectanglePath, indexToOrthogonalCoords, orthogonalCoordsToIndex, /* tileSize */ } from "../utils.js";
import { GridStyleGroup } from "../style/set.js";
import { cssValueToNumber, /* multiplyCssLength, subtractCssLength */ } from "../style/css/utils.js";

export default class RectangleGrid extends AbstractGrid<RectangleTile> {
  constructor(mapId: number, config: Config, style: GridStyleGroup) {
    super(mapId, config, style);
  }

  protected override initTiles() : void {
    for (let i = 0; i < this._size.width; i++) {
      this._tiles[i] = [];
      for (let j = 0; j < this._size.height; j++) {
        this._tiles[i]![j] = new RectangleTile(this.id, {i, j}, indexToOrthogonalCoords({i, j}), this.style.tile);
      }
    }
  }

  public override tileByCoords(firstCoord: number, secondCoord: number) : RectangleTile|undefined {
    let index = orthogonalCoordsToIndex({x: firstCoord, y: secondCoord});
    return this.tileByIndex(index.i, index.j);
  }

  /* --------
      CSS 
  -------- */

  protected override cssType() : string {
    // let tileSizeContour: tileSize = {
    //   width: subtractCssLength(this.tileSize.outer.width, multiplyCssLength(this.style.tile.contour.hover.width.length, 2)),
    //   height: subtractCssLength(this.tileSize.outer.height, multiplyCssLength(this.style.tile.contour.hover.width.length, 2))
    // }

    return ``
    // + this.selector.innerTile + `:hover:after{` +
    //   `clip-path:path(evenodd,'${generateRectanglePath(this.tileSize.outer, cssValueToNumber(this.style.self.outer.regular.borderRadius.radius))} ${generateRectanglePath(tileSizeContour, cssValueToNumber(this.style.self.inner.regular.borderRadius.radius), {top: cssValueToNumber(this.style.tile.contour.hover.width.length), left: cssValueToNumber(this.style.tile.contour.hover.width.length)})}');` +
    // `}`;
  }
  
  protected override cssFrameClipPath() {
    let path = '';
    for (let i = 0; i < this._size.width; i++) {
      for (let j = 0; j < this._size.height; j++) {
        if (path !== '') path += ' ';
        path += generateRectanglePath(
          this.tileSize.outer,
          cssValueToNumber(this.style.self.outer.regular.borderRadius.radius),
          {
            top: i * (cssValueToNumber(this.tileSize.outer.height) - cssValueToNumber(this.style.self.outer.regular.spacing.length)),
            left: j * (cssValueToNumber(this.tileSize.outer.width) - cssValueToNumber(this.style.self.outer.regular.spacing.length)) 
          }
        );
      }
    }
    return path;
  }
}