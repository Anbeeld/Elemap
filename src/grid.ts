import { AbstractTile } from "./tile.js";
import { Size, Config, tileSizeSet, GridOrientation, GridOffset, getMapById, Index, OrthogonalCoords } from "./utils.js";
import { GridStyleGroup, TileStyleSet } from "./style/set.js";
import { addCssLength, divideCssLength, multiplyCssLength, subtractCssLength } from "./style/css/utils.js";
import Raoi from 'raoi';

interface GridElements {
  frame: HTMLElement;
  outer: HTMLElement;
  inner: HTMLElement;
  outerRows: HTMLElement[];
  innerRows: HTMLElement[];
  contour: HTMLElement;
  contourHover: HTMLElement;
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
  public abstract tileByElement(element: HTMLElement) : Tile|undefined;
  public tileByIndex(i: number, j: number) : Tile|undefined {
    return this._tiles[i]?.[j];
  }

  protected _style: GridStyleGroup;
  public get style() : GridStyleGroup { return this._style; }

  protected _orientation: GridOrientation;
  public get orientation() : GridOrientation { return this._orientation; }

  protected _offset: GridOffset;
  public get offset() : GridOffset { return this._offset; }

  protected get _spacing(): string {
    return this.style.self.outer.regular.spacing.length;
  }
  public get spacing() : string { return this._spacing; }

  public get tileSize() : tileSizeSet {
    let inner = {
      width: this.style.self.inner.regular.width.length,
      height: this.style.self.inner.regular.height.length
    };
    let spaced = {
      width: addCssLength(inner.width, multiplyCssLength(this._spacing, 2)),
      height: addCssLength(inner.height, multiplyCssLength(this._spacing, 2))
    };
    let outer = {
      width: addCssLength(inner.width, this._spacing),
      height: addCssLength(inner.height, this._spacing)
    };

    return { spaced, outer, inner };
  }

  protected _elements?: GridElements;
  public get elements() : GridElements|undefined { return this._elements; }

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
    if (!this._elements) {
      this._elements = {
        frame: document.createElement('div'),
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: [],
        innerRows: [],
        contour: document.createElement('div'),
        contourHover: document.createElement('div')
      }

      this._elements.frame.classList.add('elemap-grid-frame-' + this.mapId);

      this._elements.outer.classList.add('elemap-grid-' + this.mapId);
      this._elements.outer.classList.add('elemap-grid-outer-' + this.mapId);

      this._elements.inner.classList.add('elemap-grid-' + this.mapId);
      this._elements.inner.classList.add('elemap-grid-inner-' + this.mapId);

      this._elements.contour.classList.add('elemap-grid-contour-' + this.mapId);
      this._elements.contour.appendChild(this._elements.contourHover);
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let i in this._tiles) {
      if (typeof this._elements!.outerRows[i] === 'undefined') {
        this._elements!.outerRows[i] = document.createElement('div');
        this._elements!.outer.appendChild(this._elements!.outerRows[i]);
      }
      if (typeof this._elements!.innerRows[i] === 'undefined') {
        this._elements!.innerRows[i] = document.createElement('div');
        this._elements!.inner.appendChild(this._elements!.innerRows[i]);
      }
      for (let j in this._tiles[i]) {
        this._tiles[Number(i)]![Number(j)]!.render(this._elements!.outerRows[i], this._elements!.innerRows[i]);
      }
    }

    container.appendChild(this._elements!.frame);
    container.appendChild(this._elements!.outer);
    container.appendChild(this._elements!.inner);
    container.appendChild(this._elements!.contour);

    this._elements!.inner.addEventListener('mouseover', e => {
      let tileElement = (e.target as HTMLElement).closest('.elemap-grid-inner-0 > div > div');
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.hover();
      }
    });
    
    this._elements!.inner.addEventListener('mouseout', e => {
      let tileElement = (e.target as HTMLElement).closest('.elemap-grid-inner-0 > div > div');
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.unhover();
      }
    });
  }

  public setContourPosition(position: OrthogonalCoords|false) {
    if (position === false) {
      this._elements!.contourHover.removeAttribute('style');
    } else {
      this._elements!.contourHover.style.display = `block`;
      this._elements!.contourHover.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
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
      `overflow:hidden;` + 
    `}` +

    this.selector.row + `{` +
      `display:flex;` +
      `width:max-content;` +
      `position:relative;` +
      `pointer-events:none;` +
    `}` +

    this.selector.tile + `{` +
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
    `position:absolute;` + 
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
      `width:max-content;` +
      `z-index:150;` +
    `}` + 
    this.selector.innerRow + `{` +
      `z-index:160;` + 
    `}` +

    this.selector.innerTile + `{` +
      `position:relative;` + 
      `z-index:170;` +
    `}` +

    this.selector.innerTile + `:after{` +
      `z-index:190;` +
    `}` +

    this.selector.innerTile + `>*{` +
      `position:relative;` +
      `z-index:200;` +
    `}` +

    this.selector.contour + `{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:210;` +
      `pointer-events:none;` +
    `}` +

    this.selector.contour + `>div{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:220;` +
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
      `padding: ${divideCssLength(this._spacing, 2)};` +
    `}` +

    this.selector.outerGrid + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
    `}` +

    this.selector.outerRow + `{` +
      `width: ${subtractCssLength(multiplyCssLength(this.tileSize.outer.width, this.size.width), multiplyCssLength(this._spacing, this.size.width))};` +
    `}` +
    
    this.selector.contour + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
    `}` +

    this.cssGrid() +
    this.cssType() +
    this.cssDeviatingTiles();
  }

  protected cssTileOuterMargin() : string {
    return divideCssLength(this._spacing, 2);
  }
  protected cssTileInnerMargin() : string {
    return this._spacing;
  }

  protected abstract cssFrameClipPath() : string;

  protected cssGrid() : string {
    return `` + 
    this.selector.row + `{` +
      `height:${this.tileSize.outer.height};` +
    `}` +

    this.selector.outerTile + `{` + 
      `width:${this.tileSize.outer.width};` + 
      `height:${this.tileSize.outer.height};` + 
      this.style.tile.outer.regular.css + 
    `}` +

    this.selector.innerTile + `{` +
      `width:${this.tileSize.inner.width};` + 
      `height:${this.tileSize.inner.height};` + 
      `margin:${this.cssTileOuterMargin()};` +
      this.style.self.inner.regular.css + 
      this.style.tile.inner.regular.css + 
    `}` +

    this.selector.contour + `>div{` +
      `display:none;` +
      this.style.self.inner.regular.borderRadius.css +
      `top:0;` +
      `left:0;` +
      `width:${this.tileSize.spaced.width};` +
      `height:${this.tileSize.spaced.height};` +
    `}` +

    this.cssTile(this.style.tile);
  }

  protected cssTile(style: TileStyleSet, selector: string = '', index?: Index) : string {
    let css = ``;

    if (style !== this.style.tile) {
      css += `` + 
      this.selector.outerTile + `${selector}{` +
        style.outer.regular.css + 
        `left:${multiplyCssLength(this.tileSize.outer.width, index!.j)};` +
      `}`;
    }

    css += `` +
    this.selector.innerTile + `${selector}:hover{` + 
      style.inner.hover.css +
    `}` +
    this.selector.contour + `>div{` + 
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
      outerGrid: `.elemap-grid-outer-${this.mapId}`,
      innerGrid: `.elemap-grid-inner-${this.mapId}`,
      outerRow: `.elemap-grid-outer-${this.mapId}>div`,
      innerRow: `.elemap-grid-inner-${this.mapId}>div`,
      outerTile: `.elemap-grid-outer-${this.mapId}>div>div`,
      innerTile: `.elemap-grid-inner-${this.mapId}>div>div`,
      contour: `.elemap-grid-contour-${this.mapId}`
    }
  }

  protected abstract cssType() : string;
}