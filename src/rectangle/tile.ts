import { AbstractTile } from '../tile.js';
import { OrthogonalCoords, Index } from '../utils.js';
import { GridIds } from '../register.js';

export default class RectangleTile extends AbstractTile {
  protected override _coords: OrthogonalCoords;
  protected override set coords(value: OrthogonalCoords) { this._coords = value; }
  public override get coords() : OrthogonalCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: OrthogonalCoords) {
    super(gridIds, index);
    this.coords = coords;
  }

  protected override setCoordsAttributes() {    
    if (this.elements!.outer) {
      this.elements!.outer.dataset['elemapX'] = this.coords.x.toString();
      this.elements!.outer.dataset['elemapY'] = this.coords.y.toString();
    }
    this.elements!.inner.dataset['elemapX'] = this.coords.x.toString();
    this.elements!.inner.dataset['elemapY'] = this.coords.y.toString();
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-x="${this.coords.x}"][data-elemap-y="${this.coords.y}"]`
    };
  }
}