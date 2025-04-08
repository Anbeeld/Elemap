import { AbstractGrid } from "../grid.js";
import HexagonTile from "./tile.js";
import { Config, GridOrientation, generateHexagonPath, hexagonSizeRatio, hexagonSizeSet, hexagonSize, indexToAxialCoords, axialCoordsToOrthogonal, orthogonalCoordsToIndex, GridOffset } from "../utils.js";
import { GridStyleGroup } from "../style/set.js";
import { cssValueToNumber, addCssLength, multiplyCssLength, divideCssLength, subtractCssLength } from "../style/css/utils.js";
import { MapIds } from "src/register.js";

export default class HexagonGrid extends AbstractGrid<HexagonTile> {
  public get hexagonSize() : hexagonSizeSet {
    if (this.orientation === GridOrientation.Pointy) {
      return {
        spaced: {
          side: divideCssLength(this.tileSize.spaced.height, 2),
          long: this.tileSize.spaced.height,
          short: this.tileSize.spaced.width
        },
        outer: {
          side: divideCssLength(this.tileSize.outer.height, 2),
          long: this.tileSize.outer.height,
          short: this.tileSize.outer.width
        },
        inner: {
          side: divideCssLength(this.tileSize.inner.height, 2),
          long: this.tileSize.inner.height,
          short: this.tileSize.inner.width
        }
      };
    } else {
      return {
        spaced: {
          side: divideCssLength(this.tileSize.spaced.width, 2),
          long: this.tileSize.spaced.width,
          short: this.tileSize.spaced.height
        },
        outer: {
          side: divideCssLength(this.tileSize.outer.width, 2),
          long: this.tileSize.outer.width,
          short: this.tileSize.outer.height
        },
        inner: {
          side: divideCssLength(this.tileSize.inner.width, 2),
          long: this.tileSize.inner.width,
          short: this.tileSize.inner.height
        }
      };
    }
  }

  constructor(mapIds: MapIds, config: Config, style: GridStyleGroup) {
    super(mapIds, config, style);
    this._initHexagonSize();
  }

  private _initHexagonSize() : void {
    let longSize: string;
    let difference: string;
    if (this.orientation === GridOrientation.Pointy) {
      difference = subtractCssLength(this.tileSize.outer.height, this.tileSize.inner.height);

      longSize = multiplyCssLength(this.tileSize.inner.width, hexagonSizeRatio, 0);
      this.style.self.outer.regular.setProp('height', {length: addCssLength(longSize, difference)});
      this.style.self.inner.regular.setProp('height', {length: longSize});
    } else {
      difference = subtractCssLength(this.tileSize.outer.width, this.tileSize.inner.width);

      longSize = multiplyCssLength(this.tileSize.inner.height, hexagonSizeRatio, 0);
      this.style.self.outer.regular.setProp('width', {length: addCssLength(longSize, difference)});
      this.style.self.inner.regular.setProp('width', {length: longSize, difference});
    }
  }

  protected override _initTiles() : void {
    for (let i = 0; i < this._size.width; i++) {
      this._tiles[i] = [];
      for (let j = 0; j < this._size.height; j++) {
        this._tiles[i]![j] = new HexagonTile(this.ids, {i, j}, indexToAxialCoords({i, j}, this.orientation, this.offset), this.style.tile);
      }
    }
  }
  
  public override tileByCoords(firstCoord: number, secondCoord: number) : HexagonTile|undefined {
    let index = orthogonalCoordsToIndex(axialCoordsToOrthogonal({r: firstCoord, q: secondCoord}, this.orientation, this.offset));
    return this.tileByIndex(index.i, index.j);
  }

  public override tileByElement(element: HTMLElement) : HexagonTile|undefined {
    if (element.hasAttribute('data-elemap-r') && element.hasAttribute('data-elemap-q')) {
      return this.tileByCoords(
        Number(element.getAttribute('data-elemap-r')!),
        Number(element.getAttribute('data-elemap-q')!)
      );
    }
    return undefined;
  }

  protected _hasIntendation(i: number) : boolean {
    if (this.offset === GridOffset.Odd) {
      return i % 2 === 1;
    } else {
      return i % 2 === 0;
    }
  }

  /* --------
      CSS 
  -------- */

  protected override _cssFrameClipPath() {
    let path = '';
    let topPerTile: number = cssValueToNumber(this.tileSize.spaced.height) - cssValueToNumber(this._tileRecess.vertical) - cssValueToNumber(this._spacing);
    let leftPerTile: number = cssValueToNumber(this.tileSize.spaced.width) - cssValueToNumber(this._tileRecess.horizontal) - cssValueToNumber(this._spacing);
    for (let i = 0; i < this._size.width; i++) {
      for (let j = 0; j < this._size.height; j++) {
        if (path !== '') {
          path += ' ';
        }
        path += generateHexagonPath(
          this.orientation,
          this.hexagonSize.spaced,
          cssValueToNumber(this.style.self.outer.regular.borderRadius.radius),
          {
            top: i * topPerTile + (this._hasIntendation(j) ? 1 : 0) * cssValueToNumber(this._tileIntendation.vertical),
            left: j * leftPerTile + (this._hasIntendation(i) ? 1 : 0) * cssValueToNumber(this._tileIntendation.horizontal)
          }
        );
      }
    }
    return path;
  }

  protected override _cssType() : string {
    let hexagonSizeContourLong = subtractCssLength(this.hexagonSize.spaced.long, multiplyCssLength(this.style.tile.contour.hover.width.length, 2));
    let hexagonSizeContour: hexagonSize = {
      side: divideCssLength(hexagonSizeContourLong, 2),
      long: hexagonSizeContourLong,
      short: subtractCssLength(this.hexagonSize.spaced.short, multiplyCssLength(this.style.tile.contour.hover.width.length, 2))
    }

    return `` +
    this._selector.innerTile + `{` +
      `clip-path:path('${generateHexagonPath(this.orientation, this.hexagonSize.inner, cssValueToNumber(this.style.self.outer.regular.borderRadius.radius))}');` +
    `}` +

    this._selector.outerTile + `{` +
      `clip-path:path('${generateHexagonPath(this.orientation, this.hexagonSize.outer, 0)}');` +
    `}` +

    this._selector.contour + `>div{` +
      `clip-path:path(evenodd,'${generateHexagonPath(this.orientation, this.hexagonSize.spaced, cssValueToNumber(this.style.self.outer.regular.borderRadius.radius))} ${generateHexagonPath(this.orientation, hexagonSizeContour, cssValueToNumber(this.style.self.inner.regular.borderRadius.radius), {top: cssValueToNumber(this.style.tile.contour.hover.width.length), left: cssValueToNumber(this.style.tile.contour.hover.width.length)})}');` +
    `}`
    + this._cssTileRecess()
    + this._cssTileIntendation();
  }

  /* NOTE: for pointy grids recess and intendation are made on rows, for flat grids on tiles because there are no columns in html */

  // 1/4 of height; height is longer diagonal, side is 1/2 of diagonal, thus triangles are 1/2 of 1/2 high each
  private _cssTileRecess() : string {
    if (this.orientation === GridOrientation.Pointy) {
      return `` +
      this._selector.row + `:not(:first-child){` +
        `margin-top:${subtractCssLength('0px', this._tileRecess.vertical)};` +
      `}`;
    } else {
      return `` +
      this._selector.tile + `:not(:first-child){` +
        `margin-left:${subtractCssLength(this._cssTileOuterMargin(), this._tileRecess.horizontal)};` +
      `}`;
    }
  }

  private get _tileRecess() : {vertical: string, horizontal: string} {
    if (this.orientation === GridOrientation.Pointy) {
      return {
        vertical: divideCssLength(subtractCssLength(this.tileSize.spaced.height, this._cssTileInnerMargin()), 4),
        horizontal: '0px'
      };
    } else {
      return {
        vertical: '0px',
        horizontal: divideCssLength(subtractCssLength(this.tileSize.spaced.width, this._cssTileInnerMargin()), 4)
      };
    }
  }

  private _cssTileIntendation() : string {
    let intendationRule: string = this.offset === 'even' ? '2n - 1' : '2n';
    if (this.orientation === GridOrientation.Pointy) {
      return `` +
      this._selector.row + `:nth-child(${intendationRule}){` +
        `margin-left:${/*addCssLength('0px', */this._tileIntendation.horizontal/*)*/};` +
      `}`;
    } else {
      return `` +
      this._selector.row + `:last-child{` +
        `height:${addCssLength(this.tileSize.outer.height, this._tileIntendation.vertical)};` +
      `}` +
      this._selector.tile + `:nth-child(${intendationRule}){` +
        `margin-top:${addCssLength(this._cssTileOuterMargin(), this._tileIntendation.vertical)};` +
        `margin-bottom:${addCssLength(this._cssTileOuterMargin(), subtractCssLength('0px', this._tileIntendation.vertical))};` +
      `}`;
    }
  }

  private get _tileIntendation() : {vertical: string, horizontal: string} {
    if (this.orientation === GridOrientation.Pointy) {
      return {
        vertical: '0px',
        horizontal: divideCssLength(subtractCssLength(this.tileSize.spaced.width, this._cssTileInnerMargin()), 2)
      };
    } else {
      return {
        vertical: divideCssLength(subtractCssLength(this.tileSize.spaced.height, this._cssTileInnerMargin()), 2),
        horizontal: '0px'
      };
    }
  }
}