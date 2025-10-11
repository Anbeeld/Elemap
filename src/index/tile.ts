import { CustomTileStyleDecls } from "../style/schema.js";
import { demangleCoords, demangleProperties, mangleTileStyleDecls } from "../mangle.js";
import { RectangleTile } from "../rectangle/tile.js";
import { HexagonTile } from "../hexagon/tile.js";
import { AxialCoords, Extensions, CartesianCoords, MapType, ArrayOfExtensions, prepareExtensionsInput } from "../utils.js";

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
    return this._.ids;
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

  public extend(extensions: Extensions|ArrayOfExtensions) {
    return this._.extend(prepareExtensionsInput(extensions));
  }
  
  public shrink(extensions: string[]) {
    return this._.shrink(extensions);
  }

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(mangleTileStyleDecls(decls), replace);
  }

  public get elements() : { outer?: HTMLElement, inner?: HTMLElement } {
    let elements = {};
    demangleProperties(elements, [
      ['outer', this._.elements.outer || undefined],
      ['inner', this._.elements.inner || undefined]
    ]);
    return elements;
  }
}