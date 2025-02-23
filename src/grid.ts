import { AbstractTile } from "./tile.js";
import { Size, Config, tileSizeSet, GridOrientation, GridOffset, getMapById, Index } from "./utils.js";
import { GridStyleGroup, TileStyleSet } from "./style/set.js";
import { addCssLength, divideCssLength, multiplyCssLength, subtractCssLength } from "./style/css/utils.js";
import Raoi from 'raoi';

interface GridElements {
  grid: HTMLElement;
  rows: HTMLElement[];
  frame: HTMLElement;
  contour: HTMLElement;
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
    this._id = Raoi.push(this);
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
        grid: document.createElement('div'),
        rows: [],
        frame: document.createElement('div'),
        contour: document.createElement('div')
      }

      this.elements.frame.classList.add('elemap-grid-frame-' + this.mapId);

      this.elements.grid.classList.add('elemap-grid-' + this.mapId);

      this.elements.contour.classList.add('elemap-grid-contour-' + this.mapId);
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let i in this._tiles) {
      if (typeof this.elements!.rows[i] === 'undefined') {
        this.elements!.rows[i] = document.createElement('div');
        this.elements!.grid.appendChild(this.elements!.rows[i]);
      }
      for (let j in this._tiles[i]) {
        this._tiles[Number(i)]![Number(j)]!.render(this.elements!.rows[i]);
      }
    }

    container.appendChild(this.elements!.frame);
    container.appendChild(this.elements!.grid);
    container.appendChild(this.elements!.contour);
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

    this.selector.grid + `{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:150;` +
      `overflow:hidden;` + 
    `}` + 

    this.selector.row + `{` +
      `z-index:160;` + 
      `display:flex;` +
      `width:max-content;` +
      `position:relative;` +
      `pointer-events:none;` +
    `}` +

    this.selector.tile + `{` +
      `position:relative;` + 
      `z-index:170;` + 
      `pointer-events:auto;` + 
      `float:left;` + // To collapse margins
    `}` +

    this.selector.tile + `:after{` +
      `z-index:190;` + 
    `}` +

    this.selector.tile + `>*{` +
      `position:relative;` + 
      `z-index:200;` + 
    `}`;
  }

  public get cssDynamic() : string {
    let mapPadding = getMapById(this.mapId)!.style.outer.regular.padding;
    return `` + 
    
    this.selector.frame + `{` + 
      `top: ${mapPadding.top};` + 
      `right: ${mapPadding.right};` + 
      `bottom: ${mapPadding.bottom};` + 
      `left: ${mapPadding.left};` + 
      this.style.tile.outer.regular.background.css + 
      `clip-path: path('${this.cssFrameClipPath()}');` + 
    `}` +
    
    this.selector.grid + `{` + 
      `padding: ${divideCssLength(this.style.self.outer.regular.spacing.length, 2)};` + 
    `}` +

    this.cssGrid() +
    this.cssType() +
    this.cssDeviatingTiles();
  }

  protected cssTileOuterMargin() : string {
    return divideCssLength(this.style.self.outer.regular.spacing.length, 2);
  }
  protected cssTileInnerMargin() : string {
    return this.style.self.outer.regular.spacing.length;
  }

  protected abstract cssFrameClipPath() : string;

  protected cssGrid() : string {
    return `` + 
    this.selector.row + `{` +
      `height:${subtractCssLength(this.tileSize.outer.height, this.style.self.outer.regular.spacing.length)};` +
    `}` +

    this.selector.tile + `{` + 
      `width:${this.tileSizeMiddle.width};` + 
      `height:${this.tileSizeMiddle.height};` + 
      this.style.tile.outer.regular.css + 
    `}` +

    this.selector.tile + `:before{` +
      `content:"";` + 
      `display:block;` + 
      `width:${this.tileSize.inner.width};` + 
      `height:${this.tileSize.inner.height};` + 
      `margin:${this.cssTileOuterMargin()};` +
      this.style.self.inner.regular.css + 
      this.style.tile.inner.regular.css + 
    `}` +

    // this.selector.innerTile + `:hover:after{` + 
    //   `content:"";` + 
    //   `display:block;` + 
    //   `position:absolute;` + 
    //   this.style.self.inner.regular.borderRadius.css + 
    //   `top:0;` + 
    //   `left:0;` + 
    //   `width:${this.tileSize.outer.width};` + 
    //   `height:${this.tileSize.outer.height};` + 
    // `}` +
    
    this.cssTile(this.style.tile);
  }

  protected cssTile(style: TileStyleSet, selector: string = '', index?: Index) : string {
    let css = ``;
    index; // TODO

    if (style !== this.style.tile) {
      css += `` + 
      this.selector.tile + `${selector}{` +
        style.outer.regular.css +
      `}`;
    }

    css += `` +
    this.selector.tile + `${selector}:before:hover{` + 
      style.inner.hover.css +
    `}` +
    this.selector.tile + `${selector}:hover:after{` + 
      style.contour.hover.background.css +
    `}`;

    return css;
  }

  protected cssDeviatingTiles() : string {
    let css = '';
    for (const row of this._tiles) {
      for (const tile of row) {
        if (tile.style !== this.style.tile) {
          css += this.cssTile(tile.style, tile.selector, tile.index);
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
      contour: `.elemap-grid-contour-${this.mapId}`
    }
  }

  protected abstract cssType() : string;
}