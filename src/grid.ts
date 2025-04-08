import { AbstractTile } from "./tile.js";
import { Size, Config, tileSizeSet, GridOrientation, GridOffset, Index, OrthogonalCoords } from "./utils.js";
import { GridStyleGroup, TileStyleSet } from "./style/set.js";
import { addCssLength, divideCssLength, multiplyCssLength, subtractCssLength } from "./style/css/utils.js";
import { GridIds, MapIds, Register } from "./register.js";

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
  protected _ids: GridIds;
  public get ids() : GridIds { return this._ids; }

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

  constructor(mapIds: MapIds, config: Config, style: GridStyleGroup) {
    this._ids = new GridIds(mapIds, Register.id());
    this._style = style;
    this._size = config.size!; // TODO

    this._orientation = config.grid!.orientation!;
    this._offset = config.grid!.offset!;

    this._initTiles();
  }

  protected abstract _initTiles(): void;

  protected _initElements() : void {
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

      this._elements.frame.classList.add('elemap-' + this.ids.map + '-grid-frame');

      this._elements.outer.classList.add('elemap-' + this.ids.map + '-grid');
      this._elements.outer.classList.add('elemap-' + this.ids.map + '-grid-outer');

      this._elements.inner.classList.add('elemap-' + this.ids.map + '-grid');
      this._elements.inner.classList.add('elemap-' + this.ids.map + '-grid-inner');

      this._elements.contour.classList.add('elemap-' + this.ids.map + '-grid-contour');
      this._elements.contour.appendChild(this._elements.contourHover);
    }
  }

  public render(container: HTMLElement) {
    this._initElements();

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
      let tileElement = (e.target as HTMLElement).closest(this._selector.innerTile);
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.hover();
      }
    });
    
    this._elements!.inner.addEventListener('mouseout', e => {
      let tileElement = (e.target as HTMLElement).closest(this._selector.innerTile);
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
    this._selector.frame + `{` +
      `display:block;` + 
      `position:absolute;` + 
      `z-index:50;` + 
    `}` +

    this._selector.grid + `{` +
      `overflow:hidden;` + 
    `}` +

    this._selector.row + `{` +
      `display:flex;` +
      `width:max-content;` +
      `position:relative;` +
      `pointer-events:none;` +
    `}` +

    this._selector.tile + `{` +
      `pointer-events:auto;` + 
      `float:left;` + // To collapse margins
    `}` +

    this._selector.outerGrid + `{` +
      `position:absolute;` + 
      `z-index:100;` + 
    `}` +

    this._selector.outerRow + `{` +
      `z-index:110;` + 
    `}` +

    this._selector.outerTile + `{` +
    `position:absolute;` + 
      `z-index:120;` + 
    `}` +

    this._selector.outerTile + `:before{` + 
      `z-index:130;` + 
    `}` +

    this._selector.outerTile + `:after{` + 
      `z-index:140;` + 
    `}` +

    this._selector.innerGrid + `{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:150;` +
    `}` + 
    this._selector.innerRow + `{` +
      `z-index:160;` + 
    `}` +

    this._selector.innerTile + `{` +
      `position:relative;` + 
      `z-index:170;` +
    `}` +

    this._selector.innerTile + `:after{` +
      `z-index:190;` +
    `}` +

    this._selector.innerTile + `>*{` +
      `position:relative;` +
      `z-index:200;` +
    `}` +

    this._selector.contour + `{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:210;` +
      `pointer-events:none;` +
    `}` +

    this._selector.contour + `>div{` +
      `display:block;` +
      `position:absolute;` +
      `z-index:220;` +
    `}`;
  }

  public get cssDynamic() : string {
    let mapPadding = Register.map(this.ids)!.style.outer.regular.padding;
    return `` +
    
    this._selector.frame + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
      this.style.tile.outer.regular.background.css +
      `clip-path: path('${this._cssFrameClipPath()}');` +
    `}` +
    
    this._selector.grid + `{` +
      `padding: ${divideCssLength(this._spacing, 2)};` +
    `}` +

    this._selector.outerGrid + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
    `}` +

    this._selector.outerRow + `{` +
      `width: ${subtractCssLength(multiplyCssLength(this.tileSize.outer.width, this.size.width), multiplyCssLength(this._spacing, this.size.width))};` +
    `}` +
    
    this._selector.contour + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
    `}` +

    this._cssGrid() +
    this._cssType() +
    this._cssDeviatingTiles();
  }

  protected _cssTileOuterMargin() : string {
    return divideCssLength(this._spacing, 2);
  }
  protected _cssTileInnerMargin() : string {
    return this._spacing;
  }

  protected abstract _cssFrameClipPath() : string;

  protected _cssGrid() : string {
    return `` + 
    this._selector.row + `{` +
      `height:${this.tileSize.outer.height};` +
    `}` +

    this._selector.outerTile + `{` + 
      `width:${this.tileSize.outer.width};` + 
      `height:${this.tileSize.outer.height};` + 
      this.style.tile.outer.regular.css + 
    `}` +

    this._selector.innerTile + `{` +
      `width:${this.tileSize.inner.width};` + 
      `height:${this.tileSize.inner.height};` + 
      `margin:${this._cssTileOuterMargin()};` +
      this.style.self.inner.regular.css + 
      this.style.tile.inner.regular.css + 
    `}` +

    this._selector.contour + `>div{` +
      `display:none;` +
      this.style.self.inner.regular.borderRadius.css +
      `top:0;` +
      `left:0;` +
      `width:${this.tileSize.spaced.width};` +
      `height:${this.tileSize.spaced.height};` +
    `}` +

    this._cssTile(this.style.tile);
  }

  protected _cssTile(style: TileStyleSet, _selector: string = '', index?: Index) : string {
    let css = ``;

    if (style !== this.style.tile) {
      css += `` + 
      this._selector.outerTile + `${_selector}{` +
        style.outer.regular.css + 
        `left:${multiplyCssLength(this.tileSize.outer.width, index!.j)};` +
      `}`;
    }

    css += `` +
    this._selector.innerTile + `${_selector}:hover{` + 
      style.inner.hover.css +
    `}` +
    this._selector.contour + `>div{` + 
      style.contour.hover.background.css +
    `}`;

    return css;
  }

  protected _cssDeviatingTiles() : string {
    let css = '';
    for (const row of this._tiles) {
      for (const tile of row) {
        if (tile.style !== this.style.tile) {
          css += this._cssTile(tile.style, tile.selector, tile.index);
        }
      }
    }
    return css;
  }

  protected get _selector() {
    return {
      frame: `.elemap-${this.ids.map}-grid-frame`,
      grid: `.elemap-${this.ids.map}-grid`,
      row: `.elemap-${this.ids.map}-grid>div`,
      tile: `.elemap-${this.ids.map}-grid>div>div`,
      outerGrid: `.elemap-${this.ids.map}-grid-outer`,
      innerGrid: `.elemap-${this.ids.map}-grid-inner`,
      outerRow: `.elemap-${this.ids.map}-grid-outer>div`,
      innerRow: `.elemap-${this.ids.map}-grid-inner>div`,
      outerTile: `.elemap-${this.ids.map}-grid-outer>div>div`,
      innerTile: `.elemap-${this.ids.map}-grid-inner>div>div`,
      contour: `.elemap-${this.ids.map}-grid-contour`
    }
  }

  protected abstract _cssType() : string;
}