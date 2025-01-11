import { AbstractTile } from "./tile.js";
import { Size, Config, tileSizeSet, GridOrientation, GridOffset, Index, getMapById } from "./utils.js";
import { GridStyleGroup, TileStyleSet } from "./style/set.js";
import { addCssLength, divideCssLength, multiplyCssLength, subtractCssLength } from "./style/css/utils.js";
import Raoi from 'raoi';

interface GridElements {
  outer: HTMLElement;
  inner: HTMLElement;
  outerRows: HTMLElement[];
  innerRows: HTMLElement[];
  frame: HTMLElement;
}

export abstract class AbstractGrid<Tile extends AbstractTile> {
  protected _id: number;
  public get id() : number { return this._id; }

  protected _mapId: number;
  public get mapId() : number { return this._mapId; }

  protected _size: Size;
  public get size() : Size { return this._size; }

  protected _tiles: Tile[][] = [];

  public tile(firstCoord: number, secondCoord: number) {
    return this.tileByCoords(firstCoord, secondCoord);
  }
  public abstract tileByCoords(firstCoord: number, secondCoord: number) : Tile|undefined;
  public tileByIndex(i: number, j: number) : Tile|undefined {
    return this._tiles[i]?.[j];
  }

  protected _style: GridStyleGroup;
  public get style() : GridStyleGroup { return this._style; }

  protected _orientation: GridOrientation;
  public get orientation() : GridOrientation { return this._orientation; }

  protected _offset: GridOffset;
  public get offset() : GridOffset { return this._offset; }

  public get tileSize() : tileSizeSet {
    return {
      outer: {
        width: this.style.self.outer.regular.width.length,
        height: this.style.self.outer.regular.height.length
      },
      inner: {
        width: subtractCssLength(this.style.self.outer.regular.width.length, multiplyCssLength(this.style.self.outer.regular.spacing.length, 2)),
        height: subtractCssLength(this.style.self.outer.regular.height.length, multiplyCssLength(this.style.self.outer.regular.spacing.length, 2))
      }
    };
  }
  public get tileSizeMiddle() : any {
    return {
      width: divideCssLength(addCssLength(this.tileSize.outer.width, this.tileSize.inner.width), 2),
      height: divideCssLength(addCssLength(this.tileSize.outer.height, this.tileSize.inner.height), 2),
      spacing: this.style.self.outer.regular.spacing.length
    }
  }

  protected elements?: GridElements;

  constructor(mapId: number, config: Config, style: GridStyleGroup) {
    this._id = Raoi.new(this);
    this._mapId = mapId;
    this._style = style;
    this._size = config.size!; // TODO

    this._orientation = config.grid!.orientation!;
    this._offset = config.grid!.offset!;

    this.initTiles();
  }

  protected abstract initTiles(): void;

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: [],
        innerRows: [],
        frame: document.createElement('div')
      }

      this.elements.frame.classList.add('elemap-grid-frame-' + this.mapId);

      this.elements.outer.classList.add('elemap-grid-' + this.mapId);
      this.elements.outer.classList.add('elemap-grid-outer-' + this.mapId);

      this.elements.inner.classList.add('elemap-grid-' + this.mapId);
      this.elements.inner.classList.add('elemap-grid-inner-' + this.mapId);
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let i in this._tiles) {
      if (typeof this.elements!.outerRows[i] === 'undefined') {
        this.elements!.outerRows[i] = document.createElement('div');
        this.elements!.outer.appendChild(this.elements!.outerRows[i]);
      }
      if (typeof this.elements!.innerRows[i] === 'undefined') {
        this.elements!.innerRows[i] = document.createElement('div');
        this.elements!.inner.appendChild(this.elements!.innerRows[i]);
      }
      for (let j in this._tiles[i]) {
        this._tiles[Number(i)]![Number(j)]!.render(this.elements!.outerRows[i], this.elements!.innerRows[i]);
      }
    }

    container.appendChild(this.elements!.frame);
    container.appendChild(this.elements!.outer);
    container.appendChild(this.elements!.inner);
  }

  /* --------
      CSS 
  -------- */

  public get cssStatic() : string {
    return `` +
    this.selector.frame + `{` +
      `display:block;` + 
      `position:absolute;` + 
      `z-index:50;` + 
    `}` +

    this.selector.row + `{` +
      `display:flex;` + 
      `width:max-content;` + 
      `position:relative;` + 
      `pointer-events:none;` + 
    `}` +

    this.selector.tile + `{` +
      `position:relative;` + 
      `pointer-events:auto;` + 
      `float:left;` + // To collapse margins
    `}` +

    this.selector.outerGrid + `{` +
      `position:absolute;` + 
      `z-index:100;` + 
    `}` +

    this.selector.outerRow + `{` +
      `z-index:110;` + 
    `}` +

    this.selector.outerTile + `{` +
      `z-index:120;` + 
    `}` +

    this.selector.outerTile + `:before{` + 
      `z-index:130;` + 
    `}` +

    this.selector.outerTile + `:after{` + 
      `z-index:140;` + 
    `}` +

    this.selector.innerGrid + `{` +
      `position:relative;` + 
      `z-index:150;` + 
    `}` + 
    this.selector.innerRow + `{` +
      `z-index:160;` + 
    `}` +

    this.selector.innerTile + `{` +
      `z-index:170;` + 
    `}` +

    this.selector.innerTile + `:before{` +
      `z-index:180;` + 
    `}` +

    this.selector.innerTile + `:after{` +
      `z-index:190;` + 
    `}` +

    this.selector.innerTile + `>*{` +
      `position:relative;` + 
      `z-index:200;` + 
    `}`;
  }

  public get cssDynamic() : string {
    let mapPadding = getMapById(this.mapId)!.style.outer.regular.padding;
    return `` + 
    
    this.selector.grid + `{` + 
      `padding: ${divideCssLength(this.style.self.outer.regular.spacing.length, 2)};` + 
    `}` +
    
    this.selector.frame + `{` + 
      `top: ${mapPadding.top};` + 
      `right: ${mapPadding.right};` + 
      `bottom: ${mapPadding.bottom};` + 
      `left: ${mapPadding.left};` + 
      this.style.tile.outer.regular.background.css + 
      `clip-path: path('${this.cssFrameClipPath()}');` + 
    `}`
    + this.cssGrid()
    + this.cssType()
    + this.cssDeviatingTiles();
  }

  protected cssTileOuterMargin() : string {
    return subtractCssLength('0px', divideCssLength(this.style.self.outer.regular.spacing.length, 2));
  }
  protected cssTileInnerMargin() : string {
    return this.style.self.outer.regular.spacing.length;
  }

  protected abstract cssFrameClipPath() : string;

  protected cssGrid() : string {
    return `` + 
    this.selector.outerTile + `{` +
      this.style.self.outer.regular.css + 
      `margin:${this.cssTileOuterMargin()};` + 
    `}` +

    this.selector.outerTile + `:before{` + 
      `display:block;` + 
      `position:absolute;` + 
      `width:${this.tileSizeMiddle.width};` + 
      `height:${this.tileSizeMiddle.height};` + 
      `top:${divideCssLength(this.tileSizeMiddle.spacing, 2)};` + 
      `left:${divideCssLength(this.tileSizeMiddle.spacing, 2)};` + 
      this.style.tile.outer.regular.css + 
    `}` +

    this.selector.innerTile + `{` +
      `width:${this.tileSize.outer.width};` + 
      `height:${this.tileSize.outer.height};` + 
      `margin:${this.cssTileOuterMargin()};` + 
    `}` +

    this.selector.innerTile + `:before{` + 
      `content:"";` + 
      `display:block;` + 
      `position:absolute;` + 
      `width:${this.tileSize.inner.width};` + 
      `height:${this.tileSize.inner.height};` + 
      this.style.self.inner.regular.css + 
      `margin:${this.cssTileInnerMargin()};` + 
    `}` +

    this.selector.innerTile + `:hover:after{` + 
      `content:"";` + 
      `display:block;` + 
      `position:absolute;` + 
      this.style.self.inner.regular.borderRadius.css + 
      `top:0;` + 
      `left:0;` + 
      `width:${this.tileSize.outer.width};` + 
      `height:${this.tileSize.outer.height};` + 
    `}`

    + this.cssTile(this.style.tile);
  }

  protected cssTile(style: TileStyleSet, index?: Index) : string {
    let css = ``;
    let rowNthChild = index !== undefined ? `:nth-child(${index.i + 1})` : ``;
    let colNthChild = index !== undefined ? `:nth-child(${index.j + 1})` : ``;

    if (style !== this.style.tile) {
      css += `` + 
      `.elemap-grid-outer-${this.mapId}>div${rowNthChild}>div${colNthChild}:before{` + 
        `content:"";` + 
        style.outer.regular.css + 
      `}`;
    }

    css += `` + 
    `.elemap-grid-inner-${this.mapId}>div${rowNthChild}>div${colNthChild}:before{` + 
      style.inner.regular.css + 
    `}` + 
    `.elemap-grid-inner-${this.mapId}>div${rowNthChild}>div${colNthChild}:hover:before{` + 
      style.inner.hover.css + 
    `}` + 
    `.elemap-grid-inner-${this.mapId}>div${rowNthChild}>div${colNthChild}:hover:after{` + 
      style.contour.hover.background.css + 
    `}`;

    return css;
  }

  protected cssDeviatingTiles() : string {
    let css = '';
    for (const row of this._tiles) {
      for (const tile of row) {
        if (tile.style !== this.style.tile) {
          css += this.cssTile(tile.style, tile.index);
        }
      }
    }
    return css;
  }

  protected get selector() {
    return {
      frame: `.elemap-grid-frame-${this.mapId}`,
      grid: `.elemap-grid-${this.mapId}`,
      row: `.elemap-grid-${this.mapId}>div`,
      tile: `.elemap-grid-${this.mapId}>div>div`,
      outerGrid: `.elemap-grid-outer-${this.mapId}`,
      innerGrid: `.elemap-grid-inner-${this.mapId}`,
      outerRow: `.elemap-grid-outer-${this.mapId}>div`,
      innerRow: `.elemap-grid-inner-${this.mapId}>div`,
      outerTile: `.elemap-grid-outer-${this.mapId}>div>div`,
      innerTile: `.elemap-grid-inner-${this.mapId}>div>div`
    }
  }

  protected abstract cssType() : string;
}