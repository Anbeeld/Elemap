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
  
  public get selectors() {
    return {
      data: `[data-elemap-r="${this.coords.$r}"][data-elemap-q="${this.coords.$q}"]`
    };
  }
}