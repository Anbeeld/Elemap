import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { AxialCoords, axialCoordsToOrthogonal, OrthogonalCoords } from '../utils.js';
import { demangleProperty } from '../mangle.js';
import { Register } from '../register.js';
import { TileStyleDecls } from '../style/schema.js';
import HexagonTileStyle from '../style/hexagon/tile.js';

export type HexagonTileSnapshot = TileSnapshot<AxialCoords>;

export class HexagonTile extends AbstractTile<AxialCoords> {
  constructor(args: TileArguments<AxialCoords>) {
    super(args);
  }

  public override get orthogonalCoords() : OrthogonalCoords {
    let orthogonalCoords = axialCoordsToOrthogonal(this.coords, this.grid.orientation, this.grid.offset);
    return {
      x: orthogonalCoords.x,
      y: orthogonalCoords.y
    };
  }

  public static import(snapshot: HexagonTileSnapshot) : HexagonTile {
    return this.importSnapshot(HexagonTile, snapshot);
  }
  public override export() : HexagonTileSnapshot {
    return this.exportSnapshot();
  }
    
  protected override _style: HexagonTileStyle|undefined;
  protected override set style(value: HexagonTileStyle) { this._style = value; }
  public override get style() : HexagonTileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Register.style.tile(this.ids)!;
    }
  }

  protected override createStyle(decls: TileStyleDecls) : HexagonTileStyle {
    return new HexagonTileStyle(this.ids, this.grid.style.ids, decls);
  }

  protected override setCoordsAttributes() {    
    if (this.elements!.outer) {
      demangleProperty(this.elements!.outer.dataset, 'elemapR', this.coords.r.toString());
      demangleProperty(this.elements!.outer.dataset, 'elemapQ', this.coords.q.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'elemapR', this.coords.r.toString());
    demangleProperty(this.elements!.inner.dataset, 'elemapQ', this.coords.q.toString());

    if (this.elements!.outer) {
      demangleProperty(this.elements!.outer.dataset, 'elemapX', this.orthogonalCoords.x.toString());
      demangleProperty(this.elements!.outer.dataset, 'elemapY', this.orthogonalCoords.y.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'elemapX', this.orthogonalCoords.x.toString());
    demangleProperty(this.elements!.inner.dataset, 'elemapY', this.orthogonalCoords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-r="${this.coords.r}"][data-elemap-q="${this.coords.q}"]`
    };
  }
}