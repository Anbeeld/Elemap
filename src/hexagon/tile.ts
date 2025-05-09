import { AbstractTile } from '../tile.js';
import { AxialCoords, Index } from '../utils.js';
import { GridIds } from '../register.js';

export default class HexagonTile extends AbstractTile {  
  protected override _coords: AxialCoords;
  protected override set coords(value: AxialCoords) { this._coords = value; }
  public override get coords() : AxialCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: AxialCoords) {
    super(gridIds, index);
    this.coords = coords;
  }

  protected override setCoordsAttributes() {    
    if (this.elements!.outer) {
      this.elements!.outer.dataset['elemapR'] = this.coords.r.toString();
      this.elements!.outer.dataset['elemapQ'] = this.coords.q.toString();
    }
    this.elements!.inner.dataset['elemapR'] = this.coords.r.toString();
    this.elements!.inner.dataset['elemapQ'] = this.coords.q.toString();
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-r="${this.coords.r}"][data-elemap-q="${this.coords.q}"]`
    };
  }
}