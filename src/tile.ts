import { Coords, Index, OrthogonalCoords } from './utils.js';
import { cssValueToNumber } from './style/utils.js';
import { GridIds, Register, TileIds } from './register.js';
import TileStyle from './style/tile.js';
import { modifyTileStyleDecls, CustomTileStyleDecls } from './style/schema.js';

type TileElements = {
  outer?: HTMLElement,
  inner: HTMLElement,
  style?: HTMLElement
}

export abstract class AbstractTile {
  protected _ids: TileIds;
  protected set ids(value: TileIds) { this._ids = value; }
  public get ids() : TileIds { return this._ids; }

  public get grid() { return Register.grid.abstract(this.ids)!; }

  protected _style: TileStyle|undefined;
  protected set style(value: TileStyle) { this._style = value; }
  public get style() : TileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Register.style.tile(this.ids)!;
    }
  }

  protected _elements: TileElements;
  protected set elements(value: TileElements) { this._elements = value; }
  public get elements() : TileElements { return this._elements; }

  protected _index: Index;
  protected set index(value: Index) { this._index = value; }
  public get index() : Index { return this._index; }

  protected abstract _coords: Coords;
  protected abstract set coords(value: Coords);
  public abstract get coords() : Coords;

  protected rendered: boolean = false;

  constructor(gridIds: GridIds, index: Index) {
    this.ids = new TileIds(gridIds, Register.id());
    this.index = index;
  }

  protected abstract createStyle(decls: CustomTileStyleDecls) : TileStyle;

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    if (this._style === undefined || replace) {
      this.style = this.createStyle(modifyTileStyleDecls(decls));
    } else {
      this.style = this.createStyle(modifyTileStyleDecls(decls, this.style.decls));
    }    

    if (this.rendered) {
      this.render();
    }
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div')
      }
    }
    if (this._style !== undefined && !this.style.initial) {
      if (!this.elements.style) {
        this.elements.style = document.createElement('style');
        this.elements.style.classList.add('elemap-' + this.ids.map + '-css-tile-' + this.ids.tile);
      }
      if (!this.elements.outer && (this.style.decls.outer.length || this.style.decls.hover.outer.length)) {
        this.elements.outer = document.createElement('div');
      }
    }
  }

  protected setIndexAttributes() {    
    if (this.elements!.outer) {
      this.elements!.outer.dataset['elemapI'] = this.index.i.toString();
      this.elements!.outer.dataset['elemapJ'] = this.index.j.toString();
    }
    this.elements!.inner.dataset['elemapI'] = this.index.i.toString();
    this.elements!.inner.dataset['elemapJ'] = this.index.j.toString();
  }

  protected abstract setCoordsAttributes() : void;

  public render() : void {
    let outer = this.grid.elements!.outerRows[this.index.i]!;
    let inner = this.grid.elements!.innerRows[this.index.i]!;

    this.initElements();

    this.setIndexAttributes();
    this.setCoordsAttributes();

    if (this.elements!.style) {
      this.elements.style.innerHTML = this.style.core + this.style.schema + this.style.generated;
      document.head.appendChild(this.elements.style);
    }
    if (this.elements!.outer) {
      if (!outer.contains(this.elements!.outer)) {
        outer.appendChild(this.elements!.outer);
      }
    }
    if (!inner.contains(this.elements!.inner)) {
      inner.appendChild(this.elements!.inner);
    }

    this.rendered = true;
  }

  public hover() : void {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(this.elementOffset)
    }
  }
  public unhover() : void {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get elementOffset() : OrthogonalCoords {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      let element = this.elements!.inner;
      let offset: OrthogonalCoords = {x: 0, y: 0};
      while (element) {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
        element = element.parentElement as HTMLElement;
        if (element === grid.elements!.inner) {
          return {
            x: offset.x - cssValueToNumber(grid.style.spacing),
            y: offset.y - cssValueToNumber(grid.style.spacing)
          }
        }
      }
    }
    return {
      x: 0,
      y: 0
    };
  }

  public abstract get selectors() : {[key: string]: string};
}