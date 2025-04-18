import { Coords, Index, capitalizeFirstLetter, OrthogonalCoords } from './utils.js';

import { TileStyleSet, TileStyleSetFromDecls, TileStyleSetToDecls } from './style/set.js';
import { PropValues } from './style/css/prop.js';
import { cssValueToNumber } from './style/css/utils.js';
import { GridIds, Register, TileIds } from './register.js';

export abstract class AbstractTile {
  protected _ids: TileIds;
  public get ids() : TileIds { return this._ids; }

  protected _style: TileStyleSet;
  public get style() : TileStyleSet { return this._style; }

  protected _elements?: {
    outer?: HTMLElement,
    inner: HTMLElement
  }
  public get element() : HTMLElement|undefined { return this._elements?.inner; }

  protected _index: Index;
  public get index() : Index { return this._index; }

  protected abstract _coords: Coords;
  public get coords() : Coords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, style: TileStyleSet) {
    this._ids = new TileIds(gridIds, Register.id());
    this._index = index;
    this._style = style;
  }

  protected _deviateStyle() : void {
    let grid = Register.grid(this.ids);
    if (grid && grid.style.tile === this.style) {
      this._style = TileStyleSetFromDecls(TileStyleSetToDecls(this._style));
    }
  }

  public setProp(element: 'outer'|'inner'|'contour', selector: 'regular'|'hover', prop: string, value: PropValues|string) : void {
    this._deviateStyle();
    (this._style[element] as any)[selector].setProp(prop, value); // TODO
  }

  protected _initElements() : void {
    if (!this._elements) {
      this._elements = {
        inner: document.createElement('div')
      }
    }
    if (!this._elements.outer) {
      let grid = Register.grid(this.ids);
      if (grid && grid.style.tile !== this.style) {
        this._elements.outer = document.createElement('div');
      }
    }
  }

  public render(outer: HTMLElement, inner: HTMLElement) : void {
    this._initElements();
    for (const [key, value] of Object.entries(this.coords)) {
      if (this._elements!.outer) {
        this._elements!.outer.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
      }
      this._elements!.inner.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
    }
    if (this._elements!.outer) {
      if (!outer.contains(this._elements!.outer)) {
        outer.appendChild(this._elements!.outer);
      }
    }
    if (!inner.contains(this._elements!.inner)) {
      inner.appendChild(this._elements!.inner);
    }
  }

  public hover() : void {
    let grid = Register.grid(this.ids);
    if (grid) {
      grid.setContourPosition(this._elementOffset)
    }
  }
  public unhover() : void {
    let grid = Register.grid(this.ids);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get _elementOffset() : OrthogonalCoords {
    let grid = Register.grid(this.ids);
    if (grid) {
      let element = this._elements!.inner;
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