import { generateRectanglePath, roundFloat, TileSize } from "../../utils.js";
import GridStyle from "../grid.js";
import { calc, cssValueToNumber } from "../utils.js";

export default class RectangleGridStyle extends GridStyle {
  public override get dynamicSpecific() : string {
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
    for (let i = 0; i < this.owner.size.height; i++) {
      for (let j = 0; j < this.owner.size.width; j++) {
        if (path !== '') path += ' ';
        path += generateRectanglePath(
          this.tile.size.spaced,
          cssValueToNumber(this.tile.computed.inner.borderRadius),
          {
            top: i * (cssValueToNumber(this.tile.size.spaced.height) - cssValueToNumber(this.spacing)),
            left: j * (cssValueToNumber(this.tile.size.spaced.width) - cssValueToNumber(this.spacing)) 
          }
        );
      }
    }
    return path;
  }
}