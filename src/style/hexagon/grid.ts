import { HexagonTile } from "../../hexagon/tile.js";
import { Register } from "../../register.js";
import { generateHexagonPath, GridOrientation, hexagonSize, hexagonSizeDecls, hexagonSizeRatio, CartesianCoords, Position, roundFloat } from "../../utils.js";
import GridStyle from "../grid.js";
import { TileStyleDecls } from "../schema.js";
import { calc, cssValueToNumber } from "../utils.js";
import HexagonTileStyle from "./tile.js";

export default class HexagonGridStyle extends GridStyle {
  public override get owner() { return Register.grid.hexagon(this.ids.owner)!; }

  protected override _tile: HexagonTileStyle;
  protected override set tile(value: HexagonTileStyle) { this._tile = value; }
  public override get tile() : HexagonTileStyle { return this._tile; }

  public override initTile(decls: TileStyleDecls) : void {
    this.owner.mannequin = new HexagonTile({
      ids: this.owner.ids,
      coords: { q: 0, r: 0 },
      decls: "mannequin"
    });
    this.tile = new HexagonTileStyle(this.owner.mannequin.ids, this.ids, decls, true);
  }

  public get hexagonSize() : hexagonSizeDecls {
    if (this.owner.orientation === GridOrientation.Pointy) {
      return {
        spaced: {
          side: calc.div(this.tile.size.spaced.height, 2),
          long: this.tile.size.spaced.height,
          short: this.tile.size.spaced.width
        },
        outer: {
          side: calc.div(this.tile.size.outer.height, 2),
          long: this.tile.size.outer.height,
          short: this.tile.size.outer.width
        },
        inner: {
          side: calc.div(this.tile.size.inner.height, 2),
          long: this.tile.size.inner.height,
          short: this.tile.size.inner.width
        }
      };
    } else {
      return {
        spaced: {
          side: calc.div(this.tile.size.spaced.width, 2),
          long: this.tile.size.spaced.width,
          short: this.tile.size.spaced.height
        },
        outer: {
          side: calc.div(this.tile.size.outer.width, 2),
          long: this.tile.size.outer.width,
          short: this.tile.size.outer.height
        },
        inner: {
          side: calc.div(this.tile.size.inner.width, 2),
          long: this.tile.size.inner.width,
          short: this.tile.size.inner.height
        }
      };
    }
  }

  public override compute() : void {
    this.computed = {
      outer: getComputedStyle(this.owner.elements!.outer),
      inner: getComputedStyle(this.owner.elements!.inner),
      contourHover: getComputedStyle(this.owner.elements!.contourHover)
    };
    this.tile.compute();

    this.initHexagonSize();

    this.tile.compute();
  }

  private initHexagonSize() : void {
    let longSize: string;
    let difference: string;
    if (this.owner.orientation === GridOrientation.Pointy) {
      difference = calc.sub(this.tile.size.outer.height, this.tile.size.inner.height);
      longSize = calc.round(calc.mult(this.tile.size.inner.width, hexagonSizeRatio), 0);

      this.map.elements.schema.innerHTML += `` +

      this.selectors.outerTile + `{` +
        `height:` + calc.add(longSize, difference) +
      `}` +
  
      this.selectors.innerTile + `{` +
        `height:` + longSize +
      `}`;

    } else {
      difference = calc.sub(this.tile.size.outer.width, this.tile.size.inner.width);

      longSize = calc.round(calc.mult(this.tile.size.inner.height, hexagonSizeRatio), 0);
      
      this.map.elements.schema.innerHTML += `` +

      this.selectors.outerTile + `{` +
        `width:` + calc.add(longSize, difference) +
      `}` +
  
      this.selectors.innerTile + `{` +
        `width:` + longSize +
      `}`;
    }
  }

  protected override get frameClipPath() : string {
    let path = '';

    let extremes = this.owner.extremes;
    for (let y = extremes.y.min; y <= extremes.y.max; y++) {
      for (let x = extremes.x.min; x <= extremes.x.max; x++) {
        if (!this.owner.tiles[y] || !this.owner.tiles[y]![x]) {
          continue;
        }
        if (path !== '') {
          path += ' ';
        }

        let position = this.tileOuterPosition({x, y});
        path += generateHexagonPath(
          this.owner.orientation,
          this.hexagonSize.spaced,
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

  public override get generatedSpecific() : string {
    let contourWidth = roundFloat(cssValueToNumber(this.computed.contourHover.borderWidth), 0) + 'px';
    let hexagonSizeContourLong = calc.sub(this.hexagonSize.spaced.long, calc.mult(contourWidth, 2));
    let hexagonSizeContour: hexagonSize = {
      side: calc.div(hexagonSizeContourLong, 2),
      long: hexagonSizeContourLong,
      short: calc.sub(this.hexagonSize.spaced.short, calc.mult(contourWidth, 2))
    }

    let outerPath = generateHexagonPath(this.owner.orientation, this.hexagonSize.spaced, cssValueToNumber(this.tile.computed.inner.borderRadius));
    let innerPath = generateHexagonPath(this.owner.orientation, hexagonSizeContour, cssValueToNumber(this.tile.computed.inner.borderRadius), {top: cssValueToNumber(contourWidth), left: cssValueToNumber(contourWidth)});

    return `` +
    this.selectors.innerTile + `{` +
      `clip-path:path('${generateHexagonPath(this.owner.orientation, this.hexagonSize.inner, cssValueToNumber(this.tile.computed.inner.borderRadius))}');` +
    `}` +

    this.selectors.outerTile + `{` +
      `clip-path:path('${generateHexagonPath(this.owner.orientation, this.hexagonSize.outer, 0)}');` +
    `}` +

    this.selectors.contour + `>div{` +
      `clip-path:path(evenodd,'${outerPath} ${innerPath}');` +
    `}`
    + this.cssTileIndentation();
  }

  /* NOTE: for pointy grids recess and indentation are made on rows, for flat grids on tiles because there are no columns in html */

  // 1/4 of height; height is longer diagonal, side is 1/2 of diagonal, thus triangles are 1/2 of 1/2 high each
  public get tileRecess() : {vertical: string, horizontal: string} {
    if (this.owner.orientation === GridOrientation.Pointy) {
      return {
        vertical: calc.div(this.tile.size.outer.height, 4),
        horizontal: '0px'
      };
    } else {
      return {
        vertical: '0px',
        horizontal: calc.div(this.tile.size.outer.width, 4)
      };
    }
  }

  private shouldApplyIndentation() : boolean {
    let anyTileHasIndentation = false;
    let anyTileDoesNotHaveIndentation = false;
    
    for (let row of this.owner.tiles.values) {
      for (let tile of row.values) {
        if (this.tileHasIndentation(tile.cartesianCoords)) {
          anyTileHasIndentation = true;
        } else {
          anyTileDoesNotHaveIndentation = true;
        }
      }
      if (anyTileHasIndentation && anyTileDoesNotHaveIndentation) {
        break;
      }
    }
    return anyTileHasIndentation && anyTileDoesNotHaveIndentation;
  }

  private hasEdgeIndentation() : boolean {
    let extremes = this.owner.extremes;

    for (let row of this.owner.tiles.values) {
      for (let tile of row.values) {
        let hasIndentation = this.tileHasIndentation(tile.cartesianCoords);
        if (hasIndentation === 'horizontal') {
          if (tile.cartesianCoords.x === extremes.x.max) {
            return true;
          }
        } else if (hasIndentation === 'vertical') {
          if (tile.cartesianCoords.y === extremes.y.max) {
            return true;
          }
        }
      }
    }

    return false;
  }

  private tileHasIndentation(coords: CartesianCoords) : 'horizontal'|'vertical'|false {
    if (this.owner.orientation === GridOrientation.Pointy) {
      return (this.owner.offset === 'even' && coords.y % 2 === 0) || (this.owner.offset === 'odd' && coords.y % 2 !== 0) ? 'horizontal' : false;
    } else {
      return (this.owner.offset === 'even' && coords.x % 2 === 0) || (this.owner.offset === 'odd' && coords.x % 2 !== 0) ? 'vertical' : false;
    }
  }

  private cssTileIndentation() : string {
    let css = ``;
    if (!this.shouldApplyIndentation()) {
      return css;
    }

    let extremes = this.owner.extremes;
    if (this.owner.orientation === GridOrientation.Pointy) {
      for (let y = extremes.y.min; y <= extremes.y.max; y++) {
        if ((this.owner.offset === 'even' && y % 2 === 0) || (this.owner.offset === 'odd' && y % 2 !== 0)) {
          css +=
          this.selectors.row + `[data-elemap-y="${y}"]{` +
            `left:${this.tileIndentation.horizontal};` +
          `}`;
        }
      }
    } else {
      for (let x = extremes.x.min; x <= extremes.x.max; x++) {
        if ((this.owner.offset === 'even' && x % 2 === 0) || (this.owner.offset === 'odd' && x % 2 !== 0)) {
          css +=
          this.selectors.tile + `[data-elemap-x="${x}"]{` +
            `top:${this.tileIndentation.vertical};` +
          `}`;
        }
      }
    }
    return css;
  }

  private get tileIndentation() : {vertical: string, horizontal: string} {
    if (this.owner.orientation === GridOrientation.Pointy) {
      return {
        vertical: '0px',
        horizontal: calc.div(this.tile.size.outer.width, 2)
      };
    } else {
      return {
        vertical: calc.div(this.tile.size.outer.height, 2),
        horizontal: '0px'
      };
    }
  }

  protected override get generateRowPositions() : string {
    let css = ``;
    let extremes = this.owner.extremes;
    for (let y = extremes.y.min; y <= extremes.y.max; y++) {
      if (!this.owner.tiles[y]) {
        continue;
      }
      css += this.selectors.row + `[data-elemap-y="${y}"]{` +
        `top:${calc.sub(calc.mult(y - extremes.y.min, this.tile.size.outer.height), calc.mult(this.tileRecess.vertical, y - extremes.y.min))};` +
      `}`;
    }
    return css;
  }

  protected override get rowSize() : {width: string, height: string} {
    return {
      width: calc.sub(calc.mult(this.tile.size.outer.width, this.owner.size.width), calc.mult(this.tileRecess.horizontal, this.owner.size.width - 1)),
      height: this.tile.size.outer.height
    };
  }

  protected override get gridSize() : {width: string, height: string} {
    return {
      width: calc.add(this.rowSize.width, this.shouldApplyIndentation() && this.hasEdgeIndentation() ? this.tileIndentation.horizontal : 0),
      height: calc.add(calc.sub(calc.mult(this.tile.size.outer.height, this.owner.size.height), calc.mult(this.tileRecess.vertical, this.owner.size.height - 1)), this.shouldApplyIndentation() && this.hasEdgeIndentation() ? this.tileIndentation.vertical : 0)
    };
  }
  
  public override tileOuterPosition(coords: CartesianCoords) : Position {
    let i = coords.x - this.owner.extremes.x.min,
        j = coords.y - this.owner.extremes.y.min;

    let topPerTile = calc.sub(this.tile.size.outer.height, this.tileRecess.vertical);
    let leftPerTile = calc.sub(this.tile.size.outer.width, this.tileRecess.horizontal);

    return {
      top: calc.add(calc.mult(j, topPerTile), calc.mult((this.owner.hasIndentation(coords.x) && this.shouldApplyIndentation() ? 1 : 0), this.tileIndentation.vertical)),
      left: calc.add(calc.mult(i, leftPerTile), calc.mult((this.owner.hasIndentation(coords.y) && this.shouldApplyIndentation() ? 1 : 0), this.tileIndentation.horizontal))
    }
  }

  public override tileInnerPosition(coords: CartesianCoords) : Position {
    let tileOuterPosition = this.tileOuterPosition(coords);
    return {
      top: calc.add(tileOuterPosition.top, calc.div(this.spacing, 2)),
      left: calc.add(tileOuterPosition.left, calc.div(this.spacing, 2))
    };
  }

  public override get generateTilePositions() : string {
    let css = ``;
    for (let row of this.owner.tiles.values) {
      for (let tile of row.values) {
        css +=
        this.selectors.tile + tile.selectors.data + `{` +
          // Tile indentation is already applied to the row positions
          `left:${calc.sub(this.tileOuterPosition(tile.cartesianCoords).left, this.owner.hasIndentation(tile.cartesianCoords.y) && this.shouldApplyIndentation() ? this.tileIndentation.horizontal : 0)};` +
        `}`; 
      }
    }
    return css;
  }
}