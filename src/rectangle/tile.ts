import { AbstractTile } from '../tile.js';
import { OrthogonalCoords, Index } from '../utils.js';
import { TileStyleSet } from '../style/set.js';
import { GridIds } from 'src/register.js';

export default class RectangleTile extends AbstractTile {
  protected override _coords: OrthogonalCoords;
  protected override set coords(value: OrthogonalCoords) { this._coords = value; }
  public override get coords() : OrthogonalCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: OrthogonalCoords, style: TileStyleSet) {
    super(gridIds, index, style);
    this.coords = coords;
  }
  
  public get selector() : string {
    return `[data-elemap-x="${this.coords.x}"][data-elemap-y="${this.coords.y}"]`;
  }
}