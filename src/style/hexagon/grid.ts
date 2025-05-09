import { Register } from "../../register.js";
import { generateHexagonPath, GridOrientation, hexagonSize, hexagonSizeDecls, hexagonSizeRatio, roundFloat } from "../../utils.js";
import GridStyle from "../grid.js";
import { calc, cssValueToNumber } from "../utils.js";

export default class HexagonGridStyle extends GridStyle {
  public override get owner() { return Register.grid.hexagon(this.ids.owner)!; }

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

      this.map.elements.rules.innerHTML += `` +

      this.selectors.outerTile + `{` +
        `height:` + calc.add(longSize, difference) +
      `}` +
  
      this.selectors.innerTile + `{` +
        `height:` + longSize +
      `}`;

    } else {
      difference = calc.sub(this.tile.size.outer.width, this.tile.size.inner.width);

      longSize = calc.round(calc.mult(this.tile.size.inner.height, hexagonSizeRatio), 0);
      
      this.map.elements.rules.innerHTML += `` +

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

    for (let i = 0; i < this.owner.size.height; i++) {
      for (let j = 0; j < this.owner.size.width; j++) {
        if (path !== '') {
          path += ' ';
        }
        path += generateHexagonPath(
          this.owner.orientation,
          this.hexagonSize.spaced,
          cssValueToNumber(this.tile.computed.inner.borderRadius),
          {
            top: i * topPerTile + (this.owner.hasIntendation(j) ? 1 : 0) * cssValueToNumber(this.tileIntendation.vertical),
            left: j * leftPerTile + (this.owner.hasIntendation(i) ? 1 : 0) * cssValueToNumber(this.tileIntendation.horizontal)
          }
        );
      }
    }
    return path;
  }

  public override get dynamicSpecific() : string {
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
    + this.cssTileRecess()
    + this.cssTileIntendation();
  }

  /* NOTE: for pointy grids recess and intendation are made on rows, for flat grids on tiles because there are no columns in html */

  // 1/4 of height; height is longer diagonal, side is 1/2 of diagonal, thus triangles are 1/2 of 1/2 high each
  private cssTileRecess() : string {
    if (this.owner.orientation === GridOrientation.Pointy) {
      return `` +
      this.selectors.row + `:not(:first-child){` +
        `margin-top:${calc.sub('0px', this.tileRecess.vertical)};` +
      `}`;
    } else {
      return `` +
      this.selectors.tile + `:not(:first-child){` +
        `margin-left:${calc.sub(calc.div(this.spacing, 2), this.tileRecess.horizontal)};` +
      `}`;
    }
  }

  private get tileRecess() : {vertical: string, horizontal: string} {
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

  private cssTileIntendation() : string {
    let intendationRule: string = this.owner.offset === 'even' ? '2n - 1' : '2n';
    if (this.owner.orientation === GridOrientation.Pointy) {
      return `` +
      this.selectors.row + `:nth-child(${intendationRule}){` +
        `margin-left:${/*calc.add('0px', */this.tileIntendation.horizontal/*)*/};` +
      `}`;
    } else {
      return `` +
      this.selectors.row + `:last-child{` +
        `height:${calc.add(this.tile.size.outer.height, this.tileIntendation.vertical)};` +
      `}` +
      this.selectors.tile + `:nth-child(${intendationRule}){` +
        `margin-top:${calc.add(calc.div(this.spacing, 2), this.tileIntendation.vertical)};` +
        `margin-bottom:${calc.add(calc.div(this.spacing, 2), calc.sub('0px', this.tileIntendation.vertical))};` +
      `}`;
    }
  }

  private get tileIntendation() : {vertical: string, horizontal: string} {
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
}