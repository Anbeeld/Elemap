import { AbstractGrid } from "../grid.js";
import RectangleTile from "./tile.js";
import { Config, generateRectanglePath, indexToOrthogonalCoords, orthogonalCoordsToIndex, tileSize } from "../utils.js";
import { GridStyleGroup } from "../style/set.js";
import { cssValueToNumber, multiplyCssLength, subtractCssLength } from "../style/css/utils.js";
import { MapIds } from "src/register.js";

export default class RectangleGrid extends AbstractGrid<RectangleTile> {
  constructor(mapIds: MapIds, config: Config, style: GridStyleGroup) {
    super(mapIds, config, style);
  }

  protected override initTiles() : void {
    for (let i = 0; i < this.size.height; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.size.width; j++) {
        this.tiles[i]![j] = new RectangleTile(this.ids, {i, j}, indexToOrthogonalCoords({i, j}), this.style.tile);
      }
    }
  }

  public override tileByCoords(firstCoord: number, secondCoord: number) : RectangleTile|undefined {
    let index = orthogonalCoordsToIndex({x: firstCoord, y: secondCoord});
    return this.tileByIndex(index.i, index.j);
  }
  
  public override tileByElement(element: HTMLElement) : RectangleTile|undefined {
    if (element.hasAttribute('data-elemap-x') && element.hasAttribute('data-elemap-y')) {
      return this.tileByCoords(
        Number(element.getAttribute('data-elemap-x')!),
        Number(element.getAttribute('data-elemap-y')!)
      );
    }
    return undefined;
  }

  /* --------
      CSS 
  -------- */

  protected override cssType() : string {
    let tileSizeContour: tileSize = {
      width: subtractCssLength(this.tileSize.spaced.width, multiplyCssLength(this.style.tile.contour.hover.width.length, 2)),
      height: subtractCssLength(this.tileSize.spaced.height, multiplyCssLength(this.style.tile.contour.hover.width.length, 2))
    }

    return `` +
    this.selector.contour + `>div{` +
      `clip-path:path(evenodd,'${generateRectanglePath(this.tileSize.spaced, cssValueToNumber(this.style.self.outer.regular.borderRadius.radius))} ${generateRectanglePath(tileSizeContour, cssValueToNumber(this.style.self.inner.regular.borderRadius.radius), {top: cssValueToNumber(this.style.tile.contour.hover.width.length), left: cssValueToNumber(this.style.tile.contour.hover.width.length)})}');` +
    `}`;
  }
  
  protected override cssFrameClipPath() {
    let path = '';
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        if (path !== '') path += ' ';
        path += generateRectanglePath(
          this.tileSize.spaced,
          cssValueToNumber(this.style.self.outer.regular.borderRadius.radius),
          {
            top: i * (cssValueToNumber(this.tileSize.spaced.height) - cssValueToNumber(this.spacing)),
            left: j * (cssValueToNumber(this.tileSize.spaced.width) - cssValueToNumber(this.spacing)) 
          }
        );
      }
    }
    return path;
  }
}