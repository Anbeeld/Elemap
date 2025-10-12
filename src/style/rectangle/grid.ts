import { RectangleTile } from "../../rectangle/tile.js";
import { Registry } from "../../registry.js";
import { generateRectanglePath, roundFloat, TileSize } from "../../utils.js";
import GridStyle from "../grid.js";
import { TileStyleDecls } from "../schema.js";
import { calc, cssValueToNumber } from "../utils.js";
import RectangleTileStyle from "./tile.js";

export default class RectangleGridStyle extends GridStyle {
  public override get owner() { return Registry.grid.rectangle(this.ids.owner)!; }

  protected override _tile: RectangleTileStyle;
  protected override set tile(value: RectangleTileStyle) { this._tile = value; }
  public override get tile() : RectangleTileStyle { return this._tile; }

  public override initTile(decls: TileStyleDecls) : void {
    this.owner.mannequin = new RectangleTile({
      ids: this.owner.ids,
      coords: { x: 0, y: 0 },
      decls: "mannequin"
    });
    this.tile = new RectangleTileStyle(this.owner.mannequin.ids, this.ids, decls, true);
  }

  public override get generatedSpecific() : string {
    let contourWidth = roundFloat(cssValueToNumber(this.computed.contourHover.borderWidth), 0) + 'px';

    let tileSizeContour: TileSize = {
      width: calc.sub(this.tile.size.spaced.width, calc.mult(contourWidth, 2)),
      height: calc.sub(this.tile.size.spaced.height, calc.mult(contourWidth, 2))
    }

    let outerPath = generateRectanglePath(this.tile.size.spaced, cssValueToNumber(this.tile.computed.inner.borderRadius));
    let innerPath = generateRectanglePath(tileSizeContour, cssValueToNumber(this.tile.computed.inner.borderRadius), {top: cssValueToNumber(contourWidth), left: cssValueToNumber(contourWidth)});

    return `` +
    this.selectors.contour + `>div{` +
      `clip-path:path(evenodd,'${outerPath} ${innerPath}');` +
    `}`;
  }

  protected override get frameClipPath() {
    let path = '';
    let extremes = this.owner.extremes;
    for (let y = extremes.y.min; y <= extremes.y.max; y++) {
      for (let x = extremes.x.min; x <= extremes.x.max; x++) {
        if (!this.owner.tiles[y] || !this.owner.tiles[y]![x] || !this.owner.tiles[y]![x]!.visible) {
          continue;
        }
        if (path !== '') {
          path += ' ';
        }

        let position = this.tileOuterPosition({x, y});
        path += generateRectanglePath(
          this.tile.size.spaced,
          cssValueToNumber(this.tile.computed.inner.borderRadius),
          {
            top: cssValueToNumber(position.top),
            left: cssValueToNumber(position.left)
          }
        );
      }
    }
    return path;
  }
}