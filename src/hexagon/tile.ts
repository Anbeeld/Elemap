import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { AxialCoords, axialCoordsToCartesian, CartesianCoords } from '../utils.js';
import { demangleProperty } from '../mangle.js';
import { Registry } from '../registry.js';
import { TileStyleDecls } from '../style/schema.js';
import HexagonTileStyle from '../style/hexagon/tile.js';

export type HexagonTileSnapshot = TileSnapshot<AxialCoords>;

export class HexagonTile extends AbstractTile<AxialCoords> {
  constructor(args: TileArguments<AxialCoords>) {
    super(args);
  }

  public override get cartesianCoords() : CartesianCoords {
    let cartesianCoords = axialCoordsToCartesian(this.coords, this.grid.orientation, this.grid.offset);
    return {
      x: cartesianCoords.x,
      y: cartesianCoords.y
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
      return Registry.style.tile(this.ids)!;
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
      demangleProperty(this.elements!.outer.dataset, 'elemapX', this.cartesianCoords.x.toString());
      demangleProperty(this.elements!.outer.dataset, 'elemapY', this.cartesianCoords.y.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'elemapX', this.cartesianCoords.x.toString());
    demangleProperty(this.elements!.inner.dataset, 'elemapY', this.cartesianCoords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-r="${this.coords.r}"][data-elemap-q="${this.coords.q}"]`
    };
  }
}