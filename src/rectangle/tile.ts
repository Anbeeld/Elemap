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
  
  public get selectors() {
    return {
      data: `[data-elemap-x="${this.coords.$x}"][data-elemap-y="${this.coords.$y}"]`
    };
  }
}