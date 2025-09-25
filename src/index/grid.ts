import { AxialCoords, Mutation, CartesianCoords, Size, MapType } from "../utils.js";
import { mangleCoords, demangleProperty } from "../mangle.js";
import { RectangleGrid } from "../rectangle/grid.js";
import { HexagonGrid } from "../hexagon/grid.js";
import { ElemapTile, ElemapTileType } from "./tile.js";

export type ElemapGridType<M> = 
  M extends "rectangle" ? RectangleGrid :
  M extends "hexagon" ? HexagonGrid :
  never;

export type ElemapCoords<M> = 
  M extends "rectangle" ? CartesianCoords :
  M extends "hexagon" ? AxialCoords :
  never;

export class ElemapGrid<M extends MapType> {
  private _: ElemapGridType<M>;

  constructor(grid: ElemapGridType<M>) {
    this._ = grid;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__export();
    this.demangle__report();
    this.demangle__mutate();
    this.demangle__tileByCoords();
    this.demangle__createTile();
    this.demangle__createTiles();
  }

  public export() {
    return this.method__export();
  }
  private demangle__export() {
    demangleProperty(this, 'export', () => this.method__export());
  }
  private method__export() {
    return this._.export();
  }

  public report() {
    return this.method__report();
  }
  private demangle__report() {
    demangleProperty(this, 'report', () => this.method__report());
  }
  private method__report() {
    return this._.report();
  }

  public mutate(mutation: Mutation) : void {
    return this.method__mutate(mutation);
  }
  private demangle__mutate() {
    demangleProperty(this, 'mutate', (mutation: Mutation) => this.method__mutate(mutation));
  }
  private method__mutate(mutation: Mutation) {
    return this._.mutate(mutation);
  }

  public tileByCoords(coords: ElemapCoords<M>|[number, number]) { return this.method__tileByCoords(coords); }
  private demangle__tileByCoords() {
    demangleProperty(this, 'tileByCoords', (coords: ElemapCoords<M>|[number, number]) => this.method__tileByCoords(coords));
  }
  private method__tileByCoords(coords: ElemapCoords<M>|[number, number]) : ElemapTile<M>|undefined {
    // @ts-ignore coords &
    let tile = this._.tileByCoords(Array.isArray(coords) ? coords : mangleCoords(coords));
    if (tile) {
      return new ElemapTile<M>(tile as ElemapTileType<M>);
    }
    return undefined;
  }

  public createTile(coords: ElemapCoords<M>|[number, number]) : void {
    return this.method__createTile(coords);
  }
  private demangle__createTile() {
    demangleProperty(this, 'createTile', (coords: ElemapCoords<M>|[number, number]) => this.method__createTile(coords));
  }
  private method__createTile(coords: ElemapCoords<M>|[number, number]) {
    // @ts-ignore coords &
    return this._.createTile(coords);
  }

  public createTiles(size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0]) : void {
    return this.method__createTiles(size, coords);
  }
  private demangle__createTiles() {
    demangleProperty(this, 'createTiles', (size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0]) => this.method__createTiles(size, coords));
  }
  private method__createTiles(size: Size, coords: ElemapCoords<M>|[number, number]) {
    // @ts-ignore coords &
    return this._.createTiles(size, coords);
  }
}