import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { OrthogonalCoords, shieldOrthogonalCoords, shieldProperty, unshieldOrthogonalCoords } from '../utils.js';
import { Register } from '../register.js';
import RectangleTileStyle from '../style/rectangle/tile.js';
import { TileStyleDecls } from '../style/schema.js';

export type RectangleTileSnapshot = TileSnapshot<OrthogonalCoords>;

export class RectangleTile extends AbstractTile<OrthogonalCoords> {
  constructor(args: TileArguments<OrthogonalCoords>) {
    super(args);
  }

  public static import(snapshot: RectangleTileSnapshot) : RectangleTile {
    return this.importSnapshot(RectangleTile, snapshot);
  }
  public static override importCoords(object: any) : OrthogonalCoords {
    return unshieldOrthogonalCoords(object);
  }
  public override export() : RectangleTileSnapshot {
    return this.exportSnapshot();
  }
  protected override exportCoords(): OrthogonalCoords {
    return shieldOrthogonalCoords(this.coords);
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
      shieldProperty(this.elements!.outer.dataset, 'elemapX', this.coords.x.toString());
      shieldProperty(this.elements!.outer.dataset, 'elemapY', this.coords.y.toString());
    }
    shieldProperty(this.elements!.inner.dataset, 'elemapX', this.coords.x.toString());
    shieldProperty(this.elements!.inner.dataset, 'elemapY', this.coords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-x="${this.coords.x}"][data-elemap-y="${this.coords.y}"]`
    };
  }
}