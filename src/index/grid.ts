import { AxialCoords, Extension, CartesianCoords, Size, MapType } from "../utils.js";
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
    this.demangle__extensions();
    this.demangle__extend();
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

  public set extensions(value: any) { value; }
  public get extensions() { return this.method__extensions(); }
  private demangle__extensions() {
    demangleProperty(this, 'extensions', {
      set: (value: any) => { value; },
      get: () => this.method__extensions()
    });
  }
  private method__extensions() {
    return this._.extensions;
  }

  public extend(extension: Extension) : void {
    return this.method__extend(extension);
  }
  private demangle__extend() {
    demangleProperty(this, 'extend', (extension: Extension) => this.method__extend(extension));
  }
  private method__extend(extension: Extension) {
    return this._.extend(extension);
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

  public createTile(coords: ElemapCoords<M>|[number, number], replace: boolean = false) : void {
    return this.method__createTile(coords, replace);
  }
  private demangle__createTile() {
    demangleProperty(this, 'createTile', (coords: ElemapCoords<M>|[number, number], replace: boolean = false) => this.method__createTile(coords, replace));
  }
  private method__createTile(coords: ElemapCoords<M>|[number, number], replace: boolean) {
    // @ts-ignore coords &
    return this._.createTile(coords, replace);
  }

  public createTiles(size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0], replace: boolean = false) : void {
    return this.method__createTiles(size, coords, replace);
  }
  private demangle__createTiles() {
    demangleProperty(this, 'createTiles', (size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0], replace: boolean = false) => this.method__createTiles(size, coords, replace));
  }
  private method__createTiles(size: Size, coords: ElemapCoords<M>|[number, number], replace: boolean = false) {
    // @ts-ignore coords &
    return this._.createTiles(size, coords, replace);
  }
}