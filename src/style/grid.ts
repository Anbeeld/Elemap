import { GridIds, GridStyleIds, MapStyleIds, Registry } from "../registry.js";
import { GridStyleDecls, GridStyleSchema, TileStyleDecls } from "./schema.js";
import TileStyle from "./tile.js";
import Style from "./style.js";
import { calc } from "./utils.js";
import { CartesianCoords, Position } from "../utils.js";

type GridComputed = {
  outer: CSSStyleDeclaration,
  inner: CSSStyleDeclaration,
  contourHover: CSSStyleDeclaration,
}

export default abstract class GridStyle extends Style {
  protected _ids: GridStyleIds;
  protected set ids(value: GridStyleIds) { this._ids = value; }
  public get ids() : GridStyleIds { return this._ids; }

  public override get owner() { return Registry.grid.abstract(this.ids.owner)!; }
  public get map() { return Registry.style.map.grid(this.ids.owner)!; }

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
    this.ids = new GridStyleIds(ownerIds, mapIds, Registry.id());
    this.initTile(decls.tile);
    this.decls = decls.grid;
  }

  public abstract initTile(decls: TileStyleDecls) : void;

  public override get selectors() {
    let base = `.elemap`;
    let grid = base + `-grid`;
    let id = '[data-map-id="' + this.ids.owner.map + '"]';
    return {
      base: base,
      frame: grid + `-frame` + id,
      outerFrame: grid + `-frame-outer` + id,
      innerFrame: grid + `-frame-inner` + id,
      grid: grid + id,
      row: grid + id + ` .` + this.owner.classes.row,
      tile: grid + id + ` .` + this.owner.classes.tile,
      outerGrid: grid + `-outer` + id,
      innerGrid: grid + `-inner` + id,
      outerRow: grid + `-outer` + id + ` .` + this.owner.classes.row,
      innerRow: grid + `-inner` + id + ` .` + this.owner.classes.row,
      outerTile: grid + `-outer` + id + ` .` + this.owner.classes.tile,
      innerTile: grid + `-inner` + id + ` .` + this.owner.classes.tile,
      contour: grid + `-contour` + id,
      mannequin: base + `-mannequin` + id,
      tileHidden: base + `-tile-hidden`
    }
  }

  public get spacing() : string { return calc.mult(this.tile.computed.inner.marginRight, 2); }

  public get core() : string {
    return `` +
    this.selectors.outerFrame + `{` +
      `display:block;` + 
      `position:absolute;` + 
      `z-index:50;` + 
    `}` +

    this.selectors.innerFrame + `{` +
      `position:absolute;` +
      `top:0;` +
      `left:0;` +
      `bottom:0;` +
      `right:0;` +
      `z-index:55;` +
    `}` +

    this.selectors.mannequin + `{` +
      `display:none!important;` +
    `}` +

    this.selectors.grid + `{` +
      `overflow:visible;` +
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
      `float:left;` + // Prevent collapsing margins
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
    `}` +
    
    this.selectors.tileHidden + `{` +
      `opacity: 0;` +
    `}`;
  }

  public get schema() : string {
    return `` +

    this.selectors.outerFrame + `{` + 
      this.decls.frame.outer +
    `}` +

    this.selectors.innerFrame + `{` + 
      this.decls.frame.inner +
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

    this.selectors.outerFrame + absolutePosition +

    this.selectors.outerGrid + absolutePosition +
    
    this.selectors.contour + absolutePosition +
    
    this.selectors.contour + `{` +
      `margin:${calc.div(this.spacing, 2)};` +
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



    
    this.selectors.innerFrame + `{` +
      `clip-path: path('${this.frameClipPath}');` +
    `}` +


    this.generateRowPositions +

    this.generateTilePositions +
    
    this.generatedSpecific;
  }

  protected get generateRowPositions() : string {
    let css = ``;
    let extremes = this.owner.extremes;
    for (let y = extremes.y.min; y <= extremes.y.max; y++) {
      if (!this.owner.tiles[y]) {
        continue;
      }
      css += this.selectors.row + `[data-coords-y="${y}"]{` +
        `top:${calc.mult(y - extremes.y.min, this.tile.size.outer.height)};` +
      `}`;
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

  public renderSpecificTiles() : void {
    for (let row of this.owner.tiles.values) {
      for (let tile of row.values) {
        tile.renderSpecific();
      }
    }
  }
}