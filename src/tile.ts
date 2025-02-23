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

  protected _element?: HTMLElement;
  public get element() : HTMLElement|undefined { return this._element; }

  protected _index: Index;
  public get index() : Index { return this._index; }

  protected abstract _coords: Coords;
  public get coords() : Coords { return this._coords; }

  constructor(gridId: number, index: Index, style: TileStyleSet) {
    this._id = Raoi.push(this);
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
    if (!this._element) {
      this._element = document.createElement('div');
    }
  }

  public render(row: HTMLElement) : void {
    this.initElements();
    for (const [key, value] of Object.entries(this.coords)) {
      this._element!.dataset['elemap' + capitalizeFirstLetter(key)] = value.toString();
    }
    if (!row.contains(this._element!)) {
      row.appendChild(this._element!);
    }
  }

  public abstract get selector() : string;
}