import { CustomTileStyleDecls } from "../style/schema.js";
import { demangleCoords, demangleProperties, demangleTileIds, mangleTileStyleDecls } from "../mangle.js";
import { RectangleTile } from "../rectangle/tile.js";
import { HexagonTile } from "../hexagon/tile.js";
import { AxialCoords, Extensions, CartesianCoords, MapType, ArrayOfExtensions, prepareExtensionsInput, UpdateStyleMode } from "../utils.js";

export type ElemapTileType<M> = 
  M extends MapType.Rectangle ? RectangleTile :
  M extends MapType.Hexagon ? HexagonTile :
  never;

export type ElemapCoordsType<M> = 
  M extends MapType.Rectangle ? CartesianCoords :
  M extends MapType.Hexagon ? AxialCoords :
  never;

export class ElemapTile<M extends MapType> {
  private _: ElemapTileType<M>;

  constructor(tile: ElemapTileType<M>) {
    this._ = tile;
  }

  public get ids() {
    return demangleTileIds(this._.ids);
  }

  public get coords() : ElemapCoordsType<M> {
    // @ts-ignore
    return demangleCoords(this._.coords);
  }

  public export() {
    return this._.export();
  }

  public get extensions() : Extensions {
    return this._.extensions;
  }

  public addExtensions(extensions: Extensions|ArrayOfExtensions) {
    return this._.addExtensions(prepareExtensionsInput(extensions));
  }
  
  public deleteExtensions(extensions: string[]) {
    return this._.deleteExtensions(extensions);
  }

  public updateStyle(decls: CustomTileStyleDecls, mode: UpdateStyleMode = 'add') : void {
    this._.updateStyle(mangleTileStyleDecls(decls), mode);
  }

  public get elements() : { outer?: HTMLElement, inner?: HTMLElement } {
    let elements = {};
    demangleProperties(elements, [
      ['outer', this._.elements.outer || undefined],
      ['inner', this._.elements.inner || undefined]
    ]);
    return elements;
  }

  public toggleVisibility(state?: boolean) : boolean {
    return this._.toggleVisibility(state);
  }

  public get neighbors() : ElemapTile<M>[] {
    let neighbors = [];
    for (let neighbor of this._.neighbors) {
      neighbors.push(new ElemapTile<M>(neighbor as ElemapTileType<M>));
    }
    return neighbors;
  }

  public get diagonals() : ElemapTile<M>[] {
    let diagonals = [];
    for (let diagonal of this._.diagonals) {
      diagonals.push(new ElemapTile<M>(diagonal as ElemapTileType<M>));
    }
    return diagonals;
  }
}