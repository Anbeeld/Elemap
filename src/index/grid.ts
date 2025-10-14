import { AxialCoords, Extensions, CartesianCoords, Size, MapType, SignedTable, SignedArray, ArrayOfExtensions, prepareExtensionsInput } from "../utils.js";
import { demangleGridIds, mangleCoords } from "../mangle.js";
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

type ObjectOfExtensions = Extensions;

export class ElemapGrid<M extends MapType> {
  private _: ElemapGridType<M>;

  constructor(grid: ElemapGridType<M>) {
    this._ = grid;
  }

  public get ids() {
    return demangleGridIds(this._.ids);
  }

  public export() {
    return this._.export();
  }

  public get extensions() : Extensions {
    return this._.extensions;
  }

  public addExtensions(extensions: ObjectOfExtensions|ArrayOfExtensions) {
    return this._.addExtensions(prepareExtensionsInput(extensions));
  }
  
  public deleteExtensions(extensions: string[]) {
    return this._.deleteExtensions(extensions);
  }

  public tileByCoords(coords: AccessCoords<M>|[number, number]) : ElemapTile<M>|undefined {
    // @ts-ignore coords &
    let tile = this._.tileByCoords(Array.isArray(coords) ? coords : mangleCoords(coords));
    if (tile) {
      return new ElemapTile<M>(tile as ElemapTileType<M>);
    }
    return undefined;
  }

  public createTile(coords: AccessCoords<M>|[number, number], replace: boolean = false) : ElemapTile<M>|false {
    // @ts-ignore coords &
    let createdTileCoords = this._.createTile(coords, replace);
    if (createdTileCoords) {
      return this.tileByCoords(createdTileCoords as AccessCoords<M>) || false;
    }
    return false;
  }

  public createTiles(size: Size, coords: ElemapCoords<M>|[number, number], replace: boolean = false) : (ElemapTile<M>|false)[] {
    // @ts-ignore coords &
    let createdTilesCoords = this._.createTiles(size, coords, replace);
    let createdTiles: (ElemapTile<M>|false)[] = [];
    for (let createdTileCoords of createdTilesCoords) {
      if (createdTileCoords) {
        createdTiles.push(this.tileByCoords(createdTileCoords as AccessCoords<M>) || false);
      } else {
        createdTiles.push(false);
      }
    }
    return createdTiles;
  }
  
  public get tiles() : SignedTable<ElemapTile<M>> {
    let tiles = new SignedTable<ElemapTile<M>>();
    for (let [y, row] of this._.tiles) {
      tiles[y] = new SignedArray<ElemapTile<M>>();
      for (let [x, tile] of row) {
        tiles[y][x] = new ElemapTile<M>(tile as ElemapTileType<M>);
      }
    }
    return tiles;
  }

  public deleteTile(coords: AccessCoords<M>|[number, number]) : boolean {
    // @ts-ignore coords &
    return this._.deleteTile(Array.isArray(coords) ? coords : mangleCoords(coords));
  }

  public deleteTiles(coords: AccessCoords<M>|[number, number], size: Size) : boolean[] {
    // @ts-ignore coords &
    return this._.deleteTiles(Array.isArray(coords) ? coords : mangleCoords(coords), size);
  }
}