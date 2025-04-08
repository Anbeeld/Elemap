import { AbstractTile } from '../tile.js';
import { AxialCoords, Index } from '../utils.js';
import { TileStyleSet } from '../style/set.js';
import { GridIds } from 'src/register.js';

export default class HexagonTile extends AbstractTile {
  protected override _coords: AxialCoords;

  constructor(gridIds: GridIds, index: Index, coords: AxialCoords, style: TileStyleSet) {
    super(gridIds, index, style);
    this._coords = coords;
  }
  
  public get selector() : string {
    return `[data-elemap-r="${this._coords.r}"][data-elemap-q="${this._coords.q}"]`;
  }
}