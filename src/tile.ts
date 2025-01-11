import { getGridById, Coords, Index, capitalizeFirstLetter } from './utils.js';
import Raoi from 'raoi';

import { TileStyleSet, TileStyleSetFromDecls, TileStyleSetToDecls } from './style/set.js';
import { PropValues } from './style/css/prop.js';

export abstract class AbstractTile {
  protected _id: number;
  public get id() : number { return this._id; }

  protected _gridId: number;
  public get gridId() : number { return this._gridId; }

  protected _style: TileStyleSet;
  public get style() : TileStyleSet { return this._style; }

  protected elements?: {
    outer: HTMLElement,
    inner: HTMLElement
  }
  public get element() : HTMLElement|undefined { return this.elements?.inner; }

  protected _index: Index;
  public get index() : Index { return this._index; }

  protected abstract _coords: Coords;
  public get coords() : Coords { return this._coords; }

  constructor(gridId: number, index: Index, style: TileStyleSet) {
    this._id = Raoi.new(this);
    this._gridId = gridId;
    this._index = index;
    this._style = style;
  }

  protected deviateStyle() : void {
    let grid = getGridById(this.gridId);
    if (grid && grid.style.tile === this.style) {
      this._style = TileStyleSetFromDecls(TileStyleSetToDecls(this._style));
    }
  }

  public setProp(element: 'outer'|'inner'|'contour', selector: 'regular'|'hover', prop: string, value: PropValues|string) : void {
    this.deviateStyle();
    (this._style[element] as any)[selector].setProp(prop, value); // TODO
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        outer: document.createElement('div'),
        inner: document.createElement('div')
      }
    }
  }

  public render(outer: HTMLElement, inner: HTMLElement) : void {
    this.initElements();
    for (const [key, value] of Object.entries(this.coords)) {
      this.elements!.inner.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
      this.elements!.outer.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
    }
    if (!outer.contains(this.elements!.outer)) {
      outer.appendChild(this.elements!.outer);
    }
    if (!inner.contains(this.elements!.inner)) {
      inner.appendChild(this.elements!.inner);
    }
  }
}