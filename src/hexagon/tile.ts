import { AbstractTile } from '../tile.js';
import { AxialCoords, Index } from '../utils.js';
import { TileStyleSet } from '../style/set.js';
import { GridIds } from 'src/register.js';

export default class HexagonTile extends AbstractTile {  
  protected override _coords: AxialCoords;
  protected override set coords(value: AxialCoords) { this._coords = value; }
  public override get coords() : AxialCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: AxialCoords, style: TileStyleSet) {
    super(gridIds, index, style);
    this.coords = coords;
  }
  
  public get selector() : string {
    return `[data-elemap-r="${this.coords.r}"][data-elemap-q="${this.coords.q}"]`;
  }
}