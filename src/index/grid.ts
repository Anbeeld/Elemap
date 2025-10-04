import { AxialCoords, Extensions, CartesianCoords, Size, MapType, SignedTable, SignedArray } from "../utils.js";
import { mangleCoords, demangleProperty } from "../mangle.js";
import { RectangleGrid } from "../rectangle/grid.js";
import { HexagonGrid } from "../hexagon/grid.js";
import { ElemapTile, ElemapTileType } from "./tile.js";

export type ElemapGridType<M> = 
  M extends MapType.Rectangle ? RectangleGrid :
  M extends MapType.Hexagon ? HexagonGrid :
  never;

export type ElemapCoords<M> = 
  M extends MapType.Rectangle ? CartesianCoords :
  M extends MapType.Hexagon ? AxialCoords :
  never;

export type AccessCoords<M> = 
  M extends MapType.Rectangle ? CartesianCoords :
  M extends MapType.Hexagon ? CartesianCoords|AxialCoords :
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
    this.demangle__tiles();
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

  public set extensions(value: Extensions) { value; }
  public get extensions() { return this.method__extensions(); }
  private demangle__extensions() {
    demangleProperty(this, 'extensions', {
      set: (value: Extensions) => { value; },
      get: () => this.method__extensions()
    });
  }
  private method__extensions() {
    return this._.extensions;
  }

  public extend(extension: Extensions) : void {
    return this.method__extend(extension);
  }
  private demangle__extend() {
    demangleProperty(this, 'extend', (extension: Extensions) => this.method__extend(extension));
  }
  private method__extend(extension: Extensions) {
    return this._.extend(extension);
  }

  public tileByCoords(coords: AccessCoords<M>|[number, number]) { return this.method__tileByCoords(coords); }
  private demangle__tileByCoords() {
    demangleProperty(this, 'tileByCoords', (coords: AccessCoords<M>|[number, number]) => this.method__tileByCoords(coords));
  }
  private method__tileByCoords(coords: AccessCoords<M>|[number, number]) : ElemapTile<M>|undefined {
    // @ts-ignore coords &
    let tile = this._.tileByCoords(Array.isArray(coords) ? coords : mangleCoords(coords));
    if (tile) {
      return new ElemapTile<M>(tile as ElemapTileType<M>);
    }
    return undefined;
  }

  public createTile(coords: AccessCoords<M>|[number, number], replace: boolean = false) : ElemapTile<M>|false {
    return this.method__createTile(coords, replace);
  }
  private demangle__createTile() {
    demangleProperty(this, 'createTile', (coords: AccessCoords<M>|[number, number], replace: boolean = false) => this.method__createTile(coords, replace));
  }
  private method__createTile(coords: AccessCoords<M>|[number, number], replace: boolean) : ElemapTile<M>|false {
    // @ts-ignore coords &
    let createdTileCoords = this._.createTile(coords, replace);
    if (createdTileCoords) {
      return this.method__tileByCoords(createdTileCoords as AccessCoords<M>) || false;
    }
    return false;
  }

  public createTiles(size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0], replace: boolean = false) : (ElemapTile<M>|false)[] {
    return this.method__createTiles(size, coords, replace);
  }
  private demangle__createTiles() {
    demangleProperty(this, 'createTiles', (size: Size, coords: ElemapCoords<M>|[number, number] = [0, 0], replace: boolean = false) => this.method__createTiles(size, coords, replace));
  }
  private method__createTiles(size: Size, coords: ElemapCoords<M>|[number, number], replace: boolean = false) : (ElemapTile<M>|false)[] {
    // @ts-ignore coords &
    let createdTilesCoords = this._.createTiles(size, coords, replace);
    let createdTiles: (ElemapTile<M>|false)[] = [];
    for (let createdTileCoords of createdTilesCoords) {
      if (createdTileCoords) {
        createdTiles.push(this.method__tileByCoords(createdTileCoords as AccessCoords<M>) || false);
      } else {
        createdTiles.push(false);
      }
    }
    return createdTiles;
  }
  
  public set tiles(value: SignedTable<ElemapTile<M>>) { value; }
  public get tiles() : SignedTable<ElemapTile<M>> { return this.method__tiles(); }
  private demangle__tiles() {
    demangleProperty(this, 'tiles', {
      set: (value: SignedTable<ElemapTile<M>>) => { value; },
      get: () => this.method__tiles()
    });
  }
  private method__tiles() : SignedTable<ElemapTile<M>> {
    let tiles = new SignedTable<ElemapTile<M>>();
    for (let [y, row] of this._.tiles) {
      tiles[y] = new SignedArray<ElemapTile<M>>();
      for (let [x, tile] of row) {
        tiles[y][x] = new ElemapTile<M>(tile as ElemapTileType<M>);
      }
    }
    return tiles;
  }
}