import { AbstractTile, TileSnapshot } from '../tile.js';
import { OrthogonalCoords, Index, setProperty } from '../utils.js';
import { GridIds, Register } from '../register.js';
import RectangleTileStyle from '../style/rectangle/tile.js';
import { TileStyleDecls } from '../style/schema.js';

type RectangleTileSnapshot = TileSnapshot & {
  coords: OrthogonalCoords
};

export default class RectangleTile extends AbstractTile {
  protected override _coords: OrthogonalCoords;
  protected override set coords(value: OrthogonalCoords) { this._coords = value; }
  public override get coords() : OrthogonalCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: OrthogonalCoords) {
    super(gridIds, index);
    this.coords = coords;
  }

  public static import(snapshot: RectangleTileSnapshot) : RectangleTile {
    return new RectangleTile(snapshot.ids, snapshot.index, snapshot.coords)!;
  }

  public override export() : RectangleTileSnapshot {
    return {
      ids: this.ids,
      index: this.index,
      coords: this.coords
    };
  }
  
  protected override _style: RectangleTileStyle|undefined;
  protected override set style(value: RectangleTileStyle) { this._style = value; }
  public override get style() : RectangleTileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Register.style.tile(this.ids)!;
    }
  }

  protected override createStyle(decls: TileStyleDecls) : RectangleTileStyle {
    return new RectangleTileStyle(this.ids, this.grid.style.ids, decls);
  }

  protected override setCoordsAttributes() {    
    if (this.elements!.outer) {
      setProperty(this.elements!.outer.dataset, 'elemapX', this.coords.x.toString());
      setProperty(this.elements!.outer.dataset, 'elemapY', this.coords.y.toString());
    }
    setProperty(this.elements!.inner.dataset, 'elemapX', this.coords.x.toString());
    setProperty(this.elements!.inner.dataset, 'elemapY', this.coords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-x="${this.coords.x}"][data-elemap-y="${this.coords.y}"]`
    };
  }
}