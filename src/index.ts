import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls } from "./style/schema.js";
import { Config, configToGridMapArguments } from "./config.js";
import { MapType } from "./utils.js";
import { demangleProperty } from "./mangle.js";
import { RectangleTile } from "./rectangle/tile.js";
import { HexagonTile } from "./hexagon/tile.js";
import { GridMapSnapshot } from "./map.js";

type MapTypeStrings = `${MapType}`;

type ElemapType<M> = 
  M extends "rectangle" ? RectangleMap :
  M extends "hexagon" ? HexagonMap :
  never;

export default class Elemap<M extends MapTypeStrings = `${MapType.Rectangle}`> {
  private _: ElemapType<M>;

  constructor(type?: M, config?: Config) {
    let validatedType = type === MapType.Rectangle ? MapType.Rectangle : (type === MapType.Hexagon ? MapType.Hexagon : MapType.Rectangle);

    if (validatedType === MapType.Rectangle) {
      this._ = new RectangleMap(configToGridMapArguments(config || {})) as ElemapType<M>;
    } else if (validatedType === MapType.Hexagon) {
      this._ = new HexagonMap(configToGridMapArguments(config || {})) as ElemapType<M>;
    }

    // For JavaScript - ensure methods are available by their original names
    this.demangle__export();
    this.demangle__render();
    this.demangle__tileByIndex();
  }

  public static import(snapshot: GridMapSnapshot) {
    return method__import(snapshot);
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
  
  public render(container: HTMLElement) { this.method__render(container); }
  private demangle__render() {
    demangleProperty(this, 'render', (container: HTMLElement) => this.method__render(container));
  }
  private method__render(container: HTMLElement) : void {
    this._.render(container);
  }

  public tileByIndex(i: number, j: number) { return this.method__tileByIndex(i, j); }
  private demangle__tileByIndex() {
    demangleProperty(this, 'tileByIndex', (i: number, j: number) => this.method__tileByIndex(i, j));
  }
  private method__tileByIndex(i: number, j: number) : ElemapTile<M>|undefined {
    // @ts-ignore
    let tile = this._.grid.tileByIndex(i, j);
    if (tile) {
      return new ElemapTile<M>(tile as ElemapTileType<M>);
    }
    return undefined;
  }
}

function method__import(snapshot: GridMapSnapshot) {
  return new Elemap(snapshot.type, snapshot);
}
demangleProperty(Elemap, 'import', method__import);

type ElemapTileType<M> = 
  M extends "rectangle" ? RectangleTile :
  M extends "hexagon" ? HexagonTile :
  never;

class ElemapTile<M extends MapTypeStrings> {
  private _: ElemapTileType<M>;

  constructor(tile: ElemapTileType<M>) {
    this._ = tile;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__updateStyle();
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