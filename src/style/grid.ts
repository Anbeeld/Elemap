import { GridIds, GridStyleIds, MapStyleIds, Register } from "../register.js";
import { GridStyleDecls, GridStyleSchema, TileStyleDecls } from "./schema.js";
import TileStyle from "./tile.js";
import Style from "./style.js";
import { calc } from "./utils.js";
import { CartesianCoords, Position } from "src/utils.js";

type GridComputed = {
  outer: CSSStyleDeclaration,
  inner: CSSStyleDeclaration,
  contourHover: CSSStyleDeclaration,
}

export default abstract class GridStyle extends Style {
  protected _ids: GridStyleIds;
  protected set ids(value: GridStyleIds) { this._ids = value; }
  public get ids() : GridStyleIds { return this._ids; }

  public override get owner() { return Register.grid.abstract(this.ids.owner)!; }
  public get map() { return Register.style.map.grid(this.ids.owner)!; }

  protected _decls: GridStyleDecls;
  protected set decls(value: GridStyleDecls) { this._decls = value; }
  public get decls() : GridStyleDecls { return this._decls; }

  protected _computed: GridComputed;
  protected set computed(value: GridComputed) { this._computed = value; }
  public get computed() : GridComputed { return this._computed; }
  
  protected _tile: TileStyle;
  protected set tile(value: TileStyle) { this._tile = value; }
  public get tile() : TileStyle { return this._tile; }

  public constructor(ownerIds: GridIds, mapIds: MapStyleIds, decls: GridStyleSchema) {
    super();
    this.ids = new GridStyleIds(ownerIds, mapIds, Register.id());
    this.initTile(decls.tile);
    this.decls = decls.grid;
  }

  public abstract initTile(decls: TileStyleDecls) : void;

  public override get selectors() {
    let base = `.elemap-${this.ids.owner.map}`;
    let grid = base + `-grid`;
    return {
      base: base,
      frame: grid + `-frame`,
      grid: grid,
      row: grid + `>div`,
      tile: grid + `>div>div`,
      outerGrid: grid + `-outer`,
      innerGrid: grid + `-inner`,
      outerRow: grid + `-outer>div`,
      innerRow: grid + `-inner>div`,
      outerTile: grid + `-outer>div>div`,
      innerTile: grid + `-inner>div>div`,
      contour: grid + `-contour`,
      mannequin: base + `-mannequin`
    }
  }

  public get spacing() : string { return calc.mult(this.tile.computed.inner.marginRight, 2); }

  public get core() : string {
    return `` +
    this.selectors.frame + `{` +
      `display:block;` + 
      `position:absolute;` + 
      `z-index:50;` + 
    `}` +

    this.selectors.mannequin + `{` +
      `display:none;` +
    `}` +

    this.selectors.grid + `{` +
      `overflow:hidden;` +
    `}` +

    this.selectors.row + `{` +
      `position:absolute;` +
      `left:0;` +
      `right:auto;` +
      `bottom:auto;` +
      `pointer-events:none;` +
    `}` +

    this.selectors.tile + `{` +
      `pointer-events:auto;` + 
      `float:left;` + // To collapse margins
    `}` +

    this.selectors.outerGrid + `{` +
      `position:absolute;` + 
      `z-index:100;` + 
    `}` +

    this.selectors.outerRow + `{` +
      `z-index:110;` + 
    `}` +

    this.selectors.outerTile + `{` +
      `position:absolute;` + 
      `z-index:120;` + 
    `}` +

    this.selectors.outerTile + `:before{` + 
      `z-index:130;` + 
    `}` +

    this.selectors.outerTile + `:after{` + 
      `z-index:140;` + 
    `}` +

    this.selectors.innerGrid + `{` +
      `position:relative;` +
      `z-index:150;` +
    `}` + 
    this.selectors.innerRow + `{` +
      `z-index:160;` + 
    `}` +

    this.selectors.innerTile + `{` +
      `position:absolute;` + 
      `z-index:170;` +
    `}` +

    this.selectors.innerTile + `:after{` +
      `z-index:190;` +
    `}` +

    this.selectors.innerTile + `>*{` +
      `position:relative;` +
      `z-index:200;` +
    `}` +

    this.selectors.contour + `{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:210;` +
      `pointer-events:none;` +
    `}` +

    this.selectors.contour + `>div{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:220;` +
    `}`;
  }

  public get schema() : string {
    return `` +

    this.selectors.frame + `{` + 
      this.decls.frame +
    `}` +

    this.selectors.contour + `>div{` + 
      this.decls.contour +
    `}`;
  }

  public get generated() : string {
    let absolutePosition = `{` +
      `top: ${this.map.computed.map.paddingTop};` +
      `right: ${this.map.computed.map.paddingRight};` +
      `bottom: ${this.map.computed.map.paddingBottom};` +
      `left: ${this.map.computed.map.paddingLeft};` +
    `}`;
    
    return `` +
    this.selectors.grid + `{` +
      `margin:${calc.div(this.spacing, 2)};` +
      `width: ${this.gridSize.width};` +
      `height:${this.gridSize.height};` +
    `}` +

    this.selectors.frame + absolutePosition +

    this.selectors.outerGrid + absolutePosition +
    
    this.selectors.contour + absolutePosition +
    
    this.selectors.contour + `{` +
      `margin:${calc.div(this.spacing, 2)};` +
    `}` +
    
    this.selectors.contour + `>div{` + 
      `border:none;` +
    `}` +

    this.selectors.row + `{` +
      `height:${this.tile.size.outer.height};` +
      `width: ${this.rowSize.width};` +
    `}` +






    this.selectors.outerTile + `{` + 
      `width:${this.tile.size.outer.width};` + 
      `height:${this.tile.size.outer.height};` + 
    `}` +

    this.selectors.contour + `>div{` +
      `display:none;` +
      `top:0;` +
      `left:0;` +
      `width:${this.tile.size.spaced.width};` +
      `height:${this.tile.size.spaced.height};` +
    `}` +



    
    this.selectors.frame + `{` +
      `clip-path: path('${this.frameClipPath}');` +
    `}` +


    this.generateRowPositions +

    this.generateTilePositions +
    
    this.generatedSpecific;
  }

  protected get generateRowPositions() : string {
    let css = ``;
    let i = 0;
    for (let y of this.owner.tiles.keys) {
      css += this.selectors.row + `[data-elemap-y="${y}"]{` +
        `top:${calc.mult(i, this.tile.size.outer.height)};` +
      `}`;
      i++;
    }
    return css;
  }

  public abstract get generatedSpecific() : string;

  protected abstract get frameClipPath() : string;

  public compute() : void {
    this.computed = {
      outer: getComputedStyle(this.owner.elements!.outer),
      inner: getComputedStyle(this.owner.elements!.inner),
      contourHover: getComputedStyle(this.owner.elements!.contourHover)
    };
    this.tile.compute();
  }

  protected get rowSize() : {width: string, height: string} {
    return {
      width: calc.mult(this.tile.size.outer.width, this.owner.size.width),
      height: this.tile.size.outer.height
    };
  }

  protected get gridSize() : {width: string, height: string} {
    return {
      width: this.rowSize.width,
      height: calc.mult(this.tile.size.outer.height, this.owner.size.height)
    };
  }

  public tileOuterPosition(coords: CartesianCoords) : Position {
    return {
      top: calc.mult(coords.y - this.owner.extremes.y.min, this.tile.size.outer.height),
      left: calc.mult(coords.x - this.owner.extremes.x.min, this.tile.size.outer.width)
    };
  }

  public tileInnerPosition(coords: CartesianCoords) : Position {
    let tileOuterPosition = this.tileOuterPosition(coords);
    return {
      top: calc.add(tileOuterPosition.top, calc.div(this.spacing, 2)),
      left: calc.add(tileOuterPosition.left, calc.div(this.spacing, 2))
    };
  }

  public get generateTilePositions() : string {
    let css = ``;
    for (let row of this.owner.tiles.values) {
      for (let tile of row.values) {
        css +=
        this.selectors.tile + tile.selectors.data + `{` +
          `left:${this.tileOuterPosition(tile.cartesianCoords).left};` +
        `}`; 
      }
    }
    return css;
  }

  public get tileZeroPosition() : Position {
    return {
      top: calc.add(this.map.computed.map.paddingTop, calc.div(this.spacing, 2)),
      left: calc.add(this.map.computed.map.paddingLeft, calc.div(this.spacing, 2))
    }
  }
}