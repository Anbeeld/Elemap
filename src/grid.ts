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
  protected set ids(value: GridIds) { this._ids = value; }
  public get ids() : GridIds { return this._ids; }

  protected _size: Size;
  protected set size(value: Size) { this._size = value; }
  public get size() : Size { return this._size; }

  protected tiles: Tile[][] = [];

  public tile(firstCoord: number, secondCoord: number) {
    return this.tileByCoords(firstCoord, secondCoord);
  }
  public abstract tileByCoords(firstCoord: number, secondCoord: number) : Tile|undefined;
  public abstract tileByElement(element: HTMLElement) : Tile|undefined;
  public tileByIndex(i: number, j: number) : Tile|undefined {
    return this.tiles[i]?.[j];
  }

  protected _style: GridStyleGroup;
  protected set style(value: GridStyleGroup) { this._style = value; }
  public get style() : GridStyleGroup { return this._style; }

  protected _orientation: GridOrientation;
  protected set orientation(value: GridOrientation) { this._orientation = value; }
  public get orientation() : GridOrientation { return this._orientation; }

  protected _offset: GridOffset;
  protected set offset(value: GridOffset) { this._offset = value; }
  public get offset() : GridOffset { return this._offset; }

  public get spacing() : string { return this._style.self.outer.regular.spacing.length; }

  public get tileSize() : tileSizeSet {
    let inner = {
      width: this.style.self.inner.regular.width.length,
      height: this.style.self.inner.regular.height.length
    };
    let spaced = {
      width: addCssLength(inner.width, multiplyCssLength(this.spacing, 2)),
      height: addCssLength(inner.height, multiplyCssLength(this.spacing, 2))
    };
    let outer = {
      width: addCssLength(inner.width, this.spacing),
      height: addCssLength(inner.height, this.spacing)
    };

    return { spaced, outer, inner };
  }

  protected _elements?: GridElements;
  protected set elements(value: GridElements) { this._elements = value; }
  public get elements() : GridElements|undefined { return this._elements; }

  constructor(mapIds: MapIds, config: Config, style: GridStyleGroup) {
    this.ids = new GridIds(mapIds, Register.id());
    this.style = style;
    this.size = config.size!; // TODO

    this.orientation = config.grid!.orientation!;
    this.offset = config.grid!.offset!;

    this.initTiles();
  }

  protected abstract initTiles(): void;

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        frame: document.createElement('div'),
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: [],
        innerRows: [],
        contour: document.createElement('div'),
        contourHover: document.createElement('div')
      }

      this.elements.frame.classList.add('elemap-' + this.ids.map + '-grid-frame');

      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid-outer');

      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid-inner');

      this.elements.contour.classList.add('elemap-' + this.ids.map + '-grid-contour');
      this.elements.contour.appendChild(this.elements.contourHover);
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let i in this.tiles) {
      if (typeof this.elements!.outerRows[i] === 'undefined') {
        this.elements!.outerRows[i] = document.createElement('div');
        this.elements!.outer.appendChild(this.elements!.outerRows[i]);
      }
      if (typeof this.elements!.innerRows[i] === 'undefined') {
        this.elements!.innerRows[i] = document.createElement('div');
        this.elements!.inner.appendChild(this.elements!.innerRows[i]);
      }
      for (let j in this.tiles[i]) {
        this.tiles[Number(i)]![Number(j)]!.render(this.elements!.outerRows[i], this.elements!.innerRows[i]);
      }
    }

    container.appendChild(this.elements!.frame);
    container.appendChild(this.elements!.outer);
    container.appendChild(this.elements!.inner);
    container.appendChild(this.elements!.contour);

    this.elements!.inner.addEventListener('mouseover', e => {
      let tileElement = (e.target as HTMLElement).closest(this.selector.innerTile);
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.hover();
      }
    });
    
    this.elements!.inner.addEventListener('mouseout', e => {
      let tileElement = (e.target as HTMLElement).closest(this.selector.innerTile);
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.unhover();
      }
    });
  }

  public setContourPosition(position: OrthogonalCoords|false) {
    if (position === false) {
      this.elements!.contourHover.removeAttribute('style');
    } else {
      this.elements!.contourHover.style.display = `block`;
      this.elements!.contourHover.style.transform = `translate(${position.x}px, ${position.y}px)`;
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
    let mapPadding = Register.map(this.ids)!.style.outer.regular.padding;
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
      `padding: ${divideCssLength(this.spacing, 2)};` +
    `}` +

    this.selector.outerGrid + `{` +
      `top: ${mapPadding.top};` +
      `right: ${mapPadding.right};` +
      `bottom: ${mapPadding.bottom};` +
      `left: ${mapPadding.left};` +
    `}` +

    this.selector.outerRow + `{` +
      `width: ${subtractCssLength(multiplyCssLength(this.tileSize.outer.width, this.size.width), multiplyCssLength(this.spacing, this.size.width))};` +
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
    return divideCssLength(this.spacing, 2);
  }
  protected cssTileInnerMargin() : string {
    return this.spacing;
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
    for (const row of this.tiles) {
      for (const tile of row) {
        if (tile.style !== this.style.tile) {
          css += this.cssTile(tile.style, tile.selector, tile.index);
        }
      }
    }
    return css;
  }

  protected get selector() {
    let selectorBase = `.elemap-${this.ids.map}-grid`;
    return {
      frame: selectorBase + `-frame`,
      grid: selectorBase,
      row: selectorBase + `>div`,
      tile: selectorBase + `>div>div`,
      outerGrid: selectorBase + `-outer`,
      innerGrid: selectorBase + `-inner`,
      outerRow: selectorBase + `-outer>div`,
      innerRow: selectorBase + `-inner>div`,
      outerTile: selectorBase + `-outer>div>div`,
      innerTile: selectorBase + `-inner>div>div`,
      contour: selectorBase + `-contour`
    }
  }

  protected abstract cssType() : string;
}