import { CustomTileStyleDecls } from "../style/schema.js";
import { demangleProperty, demangleCoords, mangleTileStyleDecls } from "../mangle.js";
import { RectangleTile } from "../rectangle/tile.js";
import { HexagonTile } from "../hexagon/tile.js";
import { AxialCoords, Extensions, CartesianCoords, MapType } from "../utils.js";

export type ElemapTileType<M> = 
  M extends "rectangle" ? RectangleTile :
  M extends "hexagon" ? HexagonTile :
  never;

export type ElemapCoordsType<M> = 
  M extends "rectangle" ? CartesianCoords :
  M extends "hexagon" ? AxialCoords :
  never;

export class ElemapTile<M extends MapType> {
  private _: ElemapTileType<M>;

  constructor(tile: ElemapTileType<M>) {
    this._ = tile;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__coords();
    this.demangle__export();
    this.demangle__extensions();
    this.demangle__extend();
    this.demangle__updateStyle();
  }

  public set coords(value: ElemapCoordsType<M>) { value; }
  public get coords() { return this.method__coords(); }
  private demangle__coords() {
    demangleProperty(this, 'coords', {
      set: (value: ElemapCoordsType<M>) => { value; },
      get: () => this.method__coords()
    });
  }
  private method__coords() : ElemapCoordsType<M> {
    // @ts-ignore
    return demangleCoords(this._.coords);
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

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this.method__updateStyle(decls, replace);
  }
  private demangle__updateStyle() {
    demangleProperty(this, 'updateStyle', (decls: CustomTileStyleDecls, replace: boolean = false) => this.method__updateStyle(decls, replace));
  }
  private method__updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(mangleTileStyleDecls(decls), replace);
  }
}