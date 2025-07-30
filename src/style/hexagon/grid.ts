import { HexagonTile } from "../../hexagon/tile.js";
import { Register } from "../../register.js";
import { generateHexagonPath, GridOrientation, hexagonSize, hexagonSizeDecls, hexagonSizeRatio, roundFloat } from "../../utils.js";
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
    let topPerTile: number = cssValueToNumber(this.tile.size.spaced.height) - cssValueToNumber(this.tileRecess.vertical) - cssValueToNumber(this.spacing);
    let leftPerTile: number = cssValueToNumber(this.tile.size.spaced.width) - cssValueToNumber(this.tileRecess.horizontal) - cssValueToNumber(this.spacing);

    for (let y = 0; y < this.owner.size.height; y++) {
      for (let x = 0; x < this.owner.size.width; x++) {
        if (path !== '') {
          path += ' ';
        }
        path += generateHexagonPath(
          this.owner.orientation,
          this.hexagonSize.spaced,
          cssValueToNumber(this.tile.computed.inner.borderRadius),
          {
            top: y * topPerTile + (this.owner.hasIndentation(x) ? 1 : 0) * cssValueToNumber(this.tileIndentation.vertical),
            left: x * leftPerTile + (this.owner.hasIndentation(y) ? 1 : 0) * cssValueToNumber(this.tileIndentation.horizontal)
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

  private cssTileIndentation() : string {
    let css = ``;
    if (this.owner.orientation === GridOrientation.Pointy) {
      for (let y = 0; y < this.owner.size.height; y++) {
        if ((this.owner.offset === 'even' && y % 2 === 0) || (this.owner.offset === 'odd' && y % 2 !== 0)) {
          css +=
          this.selectors.row + `[data-elemap-y="${y}"]{` +
            `left:${this.tileIndentation.horizontal};` +
          `}`;
        }
      }
    } else {
      for (let x = 0; x < this.owner.size.width; x++) {
        if ((this.owner.offset === 'even' && x % 2 === 0) || (this.owner.offset === 'odd' && x % 2 !== 0)) {
          css +=
          this.selectors.tile + `[data-elemap-x="${x}"]{` +
            `top:${this.tileIndentation.vertical};` +
          `}`;
        }
      }
      // Make last row higher to accommodate for indentation
      css +=
      this.selectors.row + `:last-child{` +
        `height:${calc.add(this.tile.size.outer.height, this.tileIndentation.vertical)};` +
      `}`;
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
    let i = 0;
    for (let y of this.owner.tiles.keys) {
      css += this.selectors.row + `[data-elemap-y="${y}"]{` +
        `top:${calc.sub(calc.mult(i, this.tile.size.outer.height), calc.mult(this.tileRecess.vertical, i))};` +
      `}`;
      i++;
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
      width: calc.add(this.rowSize.width, this.tileIndentation.horizontal),
      height: calc.add(calc.sub(calc.mult(this.tile.size.outer.height, this.owner.size.height), calc.mult(this.tileRecess.vertical, this.owner.size.height - 1)), this.tileIndentation.vertical)
    };
  }
}