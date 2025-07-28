import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls } from "./style/schema.js";
import { Config, configToGridMapArguments } from "./config.js";
import { MapType, Mutation, OrthogonalCoords } from "./utils.js";
import { demangleProperty } from "./mangle.js";
import { RectangleTile } from "./rectangle/tile.js";
import { HexagonTile } from "./hexagon/tile.js";
import { GridMapMutation, GridMapSnapshot } from "./map.js";
import { RectangleGrid } from "./rectangle/grid.js";
import { HexagonGrid } from "./hexagon/grid.js";

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
    this.demangle__report();
    this.demangle__render();
    this.demangle__mutate();
    this.demangle__grid();
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

  public report() {
    return this.method__report();
  }
  private demangle__report() {
    demangleProperty(this, 'report', () => this.method__report());
  }
  private method__report() {
    return this._.report();
  }

  public mutate(mutation: GridMapMutation) : void {
    return this.method__mutate(mutation);
  }
  private demangle__mutate() {
    demangleProperty(this, 'mutate', (mutation: GridMapMutation) => this.method__mutate(mutation));
  }
  private method__mutate(mutation: GridMapMutation) {
    return this._.mutate(mutation);
  }
  
  public render(container: HTMLElement) { this.method__render(container); }
  private demangle__render() {
    demangleProperty(this, 'render', (container: HTMLElement) => this.method__render(container));
  }
  private method__render(container: HTMLElement) : void {
    this._.render(container);
  }

  public set grid(value: any) { value; }
  public get grid() { return this.method__grid(); }
  private demangle__grid() {
    demangleProperty(this, 'grid', {
      set: (value: any) => { value; },
      get: () => this.method__grid()
    });
  }
  private method__grid() : ElemapGrid<M>|undefined {
    let grid = this._.grid;
    if (grid) {
      return new ElemapGrid<M>(grid as ElemapGridType<M>);
    }
    return undefined;
  }
}

function method__import(snapshot: GridMapSnapshot) {
  return new Elemap(snapshot.type, snapshot);
}
demangleProperty(Elemap, 'import', method__import);

type ElemapGridType<M> = 
  M extends "rectangle" ? RectangleGrid :
  M extends "hexagon" ? HexagonGrid :
  never;

class ElemapGrid<M extends MapTypeStrings> {
  private _: ElemapGridType<M>;

  constructor(grid: ElemapGridType<M>) {
    this._ = grid;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__export();
    this.demangle__report();
    this.demangle__mutate();
    this.demangle__tileByCoords();
    this.demangle__createTile();
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

  public tileByCoords(firstCoord: number, secondCoord: number) { return this.method__tileByCoords(firstCoord, secondCoord); }
  private demangle__tileByCoords() {
    demangleProperty(this, 'tileByCoords', (firstCoord: number, secondCoord: number) => this.method__tileByCoords(firstCoord, secondCoord));
  }
  private method__tileByCoords(firstCoord: number, secondCoord: number) : ElemapTile<M>|undefined {
    let tile = this._.tileByCoords(firstCoord, secondCoord);
    if (tile) {
      return new ElemapTile<M>(tile as ElemapTileType<M>);
    }
    return undefined;
  }

  public createTile(coords: OrthogonalCoords) : void {
    return this.method__createTile(coords);
  }
  private demangle__createTile() {
    demangleProperty(this, 'createTile', (coords: OrthogonalCoords) => this.method__createTile(coords));
  }
  private method__createTile(coords: OrthogonalCoords) {
    return this._.createTile(coords);
  }
}

type ElemapTileType<M> = 
  M extends "rectangle" ? RectangleTile :
  M extends "hexagon" ? HexagonTile :
  never;

class ElemapTile<M extends MapTypeStrings> {
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