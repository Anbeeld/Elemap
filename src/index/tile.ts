import { CustomTileStyleDecls } from "../style/schema.js";
import { demangleProperty } from "../mangle.js";
import { RectangleTile } from "../rectangle/tile.js";
import { HexagonTile } from "../hexagon/tile.js";
import { MapTypeStrings } from "./index.js";
import { Mutation } from "../utils.js";

export type ElemapTileType<M> = 
  M extends "rectangle" ? RectangleTile :
  M extends "hexagon" ? HexagonTile :
  never;

export class ElemapTile<M extends MapTypeStrings> {
  private _: ElemapTileType<M>;

  constructor(tile: ElemapTileType<M>) {
    this._ = tile;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__export();
    this.demangle__report();
    this.demangle__mutate();
    this.demangle__updateStyle();
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

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this.method__updateStyle(decls, replace);
  }
  private demangle__updateStyle() {
    demangleProperty(this, 'updateStyle', (decls: CustomTileStyleDecls, replace: boolean = false) => this.method__updateStyle(decls, replace));
  }
  private method__updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(decls, replace);
  }
}