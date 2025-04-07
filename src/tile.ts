import { getGridById, Coords, Index, capitalizeFirstLetter, OrthogonalCoords } from './utils.js';
import Raoi from 'raoi';

import { TileStyleSet, TileStyleSetFromDecls, TileStyleSetToDecls } from './style/set.js';
import { PropValues } from './style/css/prop.js';
import { cssValueToNumber } from './style/css/utils.js';

export abstract class AbstractTile {
  protected _id: number;
  public get id() : number { return this._id; }

  protected _gridId: number;
  public get gridId() : number { return this._gridId; }

  protected _style: TileStyleSet;
  public get style() : TileStyleSet { return this._style; }

  protected elements?: {
    outer?: HTMLElement,
    inner: HTMLElement
  }
  public get element() : HTMLElement|undefined { return this.elements?.inner; }

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
    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div')
      }
    }
    if (!this.elements.outer) {
      let grid = getGridById(this.gridId);
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
    let grid = getGridById(this.gridId);
    if (grid) {
      grid.setContourPosition(this.elementOffset)
    }
  }
  public unhover() : void {
    let grid = getGridById(this.gridId);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get elementOffset() : OrthogonalCoords {
    let grid = getGridById(this.gridId);
    if (grid) {
      // let map = getMapById(grid.mapId);
      // if (map) {
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
      // }
    }
    return {
      x: 0,
      y: 0
    };
  }

  public abstract get selector() : string;
}