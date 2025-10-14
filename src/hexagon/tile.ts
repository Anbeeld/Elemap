import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { alignedAxialCoords, AxialCoords, axialCoordsToCartesian, axialDistance, CartesianCoords, cartesianCoordsToAxial, hexagonNeighbors, isCartesianCoords } from '../utils.js';
import { demangleProperty } from '../mangle.js';
import { Registry } from '../registry.js';
import { TileStyleDecls } from '../style/schema.js';
import HexagonTileStyle from '../style/hexagon/tile.js';
import { HexagonGrid } from './grid.js';

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
      demangleProperty(this.elements!.outer.dataset, 'coordsR', this.coords.r.toString());
      demangleProperty(this.elements!.outer.dataset, 'coordsQ', this.coords.q.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'coordsR', this.coords.r.toString());
    demangleProperty(this.elements!.inner.dataset, 'coordsQ', this.coords.q.toString());

    if (this.elements!.outer) {
      demangleProperty(this.elements!.outer.dataset, 'coordsX', this.cartesianCoords.x.toString());
      demangleProperty(this.elements!.outer.dataset, 'coordsY', this.cartesianCoords.y.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'coordsX', this.cartesianCoords.x.toString());
    demangleProperty(this.elements!.inner.dataset, 'coordsY', this.cartesianCoords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-coords-r="${this.coords.r}"][data-coords-q="${this.coords.q}"]`
    };
  }

  public override get neighborCoords() : AxialCoords[] {
    return hexagonNeighbors(this.coords);
  }
  
  public override get neighbors() : HexagonTile[] {
    let neighbors: HexagonTile[] = [];
    for (let coords of this.neighborCoords) {
      let tile = (this.grid as HexagonGrid).tileByCoords(coords);
      if (tile) {
        neighbors.push(tile);
      }
    }
    return neighbors;
  }

  public override get diagonalCoords() : AxialCoords[] {
    return [];
  }

  public override get diagonals() : HexagonTile[] {
    return [];
  }

  public override distanceToCoords(coords: AxialCoords|CartesianCoords|[number, number]) : number {
    coords = this.grid.prepareCoordsInput(coords) as AxialCoords|CartesianCoords;
    if (isCartesianCoords(coords)) {
      coords = cartesianCoordsToAxial(coords as CartesianCoords, this.grid.orientation, this.grid.offset);
    }
    return axialDistance(this.coords, coords as AxialCoords);
  }

  public override alignedWithCoords(coords: AxialCoords|CartesianCoords|[number, number]) : boolean {
    coords = this.grid.prepareCoordsInput(coords) as AxialCoords|CartesianCoords;
    if (isCartesianCoords(coords)) {
      coords = cartesianCoordsToAxial(coords as CartesianCoords, this.grid.orientation, this.grid.offset);
    }
    return alignedAxialCoords(this.coords, coords as AxialCoords);
  }
}