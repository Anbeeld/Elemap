import { AbstractTile } from '../tile.js';
import { OrthogonalCoords, Index } from '../utils.js';
import { TileStyleSet } from '../style/set.js';
import { GridIds } from 'src/register.js';

export default class RectangleTile extends AbstractTile {
  protected _coords: OrthogonalCoords;

  constructor(gridIds: GridIds, index: Index, coords: OrthogonalCoords, style: TileStyleSet) {
    super(gridIds, index, style);
    this._coords = coords;
  }
  
  public get selector() : string {
    return `[data-elemap-x="${this._coords.x}"][data-elemap-y="${this._coords.y}"]`;
  }
}