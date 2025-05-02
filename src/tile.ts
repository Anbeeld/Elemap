import { Coords, Index, capitalizeFirstLetter, OrthogonalCoords } from './utils.js';

import { TileStyleSet, TileStyleSetFromDecls, TileStyleSetToDecls } from './style/set.js';
import { PropValues } from './style/css/prop.js';
import { cssValueToNumber } from './style/css/utils.js';
import { GridIds, Register, TileIds } from './register.js';

export abstract class AbstractTile {
  protected _ids: TileIds;
  protected set ids(value: TileIds) { this._ids = value; }
  public get ids() : TileIds { return this._ids; }

  protected _style: TileStyleSet;
  protected set style(value: TileStyleSet) { this._style = value; }
  public get style() : TileStyleSet { return this._style; }

  protected elements?: {
    outer?: HTMLElement,
    inner: HTMLElement
  }

  public get element() : HTMLElement|undefined { return this.elements?.inner; }

  protected _index: Index;
  protected set index(value: Index) { this._index = value; }
  public get index() : Index { return this._index; }

  protected abstract _coords: Coords;
  protected abstract set coords(value: Coords);
  public abstract get coords() : Coords;

  constructor(gridIds: GridIds, index: Index, style: TileStyleSet) {
    this.ids = new TileIds(gridIds, Register.id());
    this.index = index;
    this.style = style;
  }

  protected deviateStyle() : void {
    let grid = Register.grid(this.ids);
    if (grid && grid.style.tile === this.style) {
      this.style = TileStyleSetFromDecls(TileStyleSetToDecls(this.style));
    }
  }

  public setProp(element: 'outer'|'inner'|'contour', selector: 'regular'|'hover', prop: string, value: PropValues|string) : void {
    this.deviateStyle();
    (this.style[element] as any)[selector].setProp(prop, value); // TODO
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div')
      }
    }
    if (!this.elements.outer) {
      let grid = Register.grid(this.ids);
      if (grid && grid.style.tile !== this.style) {
        this.elements.outer = document.createElement('div');
      }
    }
  }

  public render(outer: HTMLElement, inner: HTMLElement) : void {
    this.initElements();
    for (const [key, value] of Object.entries(this.coords)) {
      if (this.elements!.outer) {
        this.elements!.outer.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
      }
      this.elements!.inner.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
    }
    if (this.elements!.outer) {
      if (!outer.contains(this.elements!.outer)) {
        outer.appendChild(this.elements!.outer);
      }
    }
    if (!inner.contains(this.elements!.inner)) {
      inner.appendChild(this.elements!.inner);
    }
  }

  public hover() : void {
    let grid = Register.grid(this.ids);
    if (grid) {
      grid.setContourPosition(this.elementOffset)
    }
  }
  public unhover() : void {
    let grid = Register.grid(this.ids);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get elementOffset() : OrthogonalCoords {
    let grid = Register.grid(this.ids);
    if (grid) {
      let element = this.elements!.inner;
      let offset: OrthogonalCoords = {x: 0, y: 0};
      while (element) {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
        element = element.parentElement as HTMLElement;
        if (element === grid.elements!.inner) {
          return {
            x: offset.x - cssValueToNumber(grid.spacing),
            y: offset.y - cssValueToNumber(grid.spacing)
          }
        }
      }
    }
    return {
      x: 0,
      y: 0
    };
  }

  public abstract get selector() : string;
}