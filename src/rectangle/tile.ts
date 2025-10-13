import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { CartesianCoords, rectangeDiagonals, rectangeNeighbors } from '../utils.js';
import { demangleProperty } from '../mangle.js';
import { Registry } from '../registry.js';
import RectangleTileStyle from '../style/rectangle/tile.js';
import { TileStyleDecls } from '../style/schema.js';
import { RectangleGrid } from './grid.js';

export type RectangleTileSnapshot = TileSnapshot<CartesianCoords>;

export class RectangleTile extends AbstractTile<CartesianCoords> {
  constructor(args: TileArguments<CartesianCoords>) {
    super(args);
  }
  
  public override get cartesianCoords() : CartesianCoords {
    return this.coords;
  }

  public static import(snapshot: RectangleTileSnapshot) : RectangleTile {
    return this.importSnapshot(RectangleTile, snapshot);
  }
  public override export() : RectangleTileSnapshot {
    return this.exportSnapshot();
  }
  
  protected override _style: RectangleTileStyle|undefined;
  protected override set style(value: RectangleTileStyle) { this._style = value; }
  public override get style() : RectangleTileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Registry.style.tile(this.ids)!;
    }
  }

  protected override createStyle(decls: TileStyleDecls) : RectangleTileStyle {
    return new RectangleTileStyle(this.ids, this.grid.style.ids, decls);
  }

  protected override setCoordsAttributes() {
    if (this.elements!.outer) {
      demangleProperty(this.elements!.outer.dataset, 'coordsX', this.coords.x.toString());
      demangleProperty(this.elements!.outer.dataset, 'coordsY', this.coords.y.toString());
    }
    demangleProperty(this.elements!.inner.dataset, 'coordsX', this.coords.x.toString());
    demangleProperty(this.elements!.inner.dataset, 'coordsY', this.coords.y.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-coords-x="${this.coords.x}"][data-coords-y="${this.coords.y}"]`
    };
  }

  public override get neighbors() : RectangleTile[] {
    let neighborCoords = rectangeNeighbors(this.coords);
    let neighbors: RectangleTile[] = [];
    for (let coords of neighborCoords) {
      let tile = (this.grid as RectangleGrid).tileByCoords(coords);
      if (tile) {
        neighbors.push(tile);
      }
    }
    return neighbors;
  }

  public override get diagonals() : RectangleTile[] {
    let diagonalCoords = rectangeDiagonals(this.coords);
    let diagonals: RectangleTile[] = [];
    for (let coords of diagonalCoords) {
      let tile = (this.grid as RectangleGrid).tileByCoords(coords);
      if (tile) {
        diagonals.push(tile);
      }
    }
    return diagonals;
  }
}