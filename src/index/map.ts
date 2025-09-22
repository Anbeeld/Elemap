import RectangleMap from "../rectangle/map.js";
import HexagonMap from "../hexagon/map.js";
import { Config, configToGridMapArguments } from "../config.js";
import { MapType, Position } from "../utils.js";
import { demangleProperty } from "../mangle.js";
import { GridMapMutation, GridMapSnapshot } from "../map.js";
import { ElemapGrid, ElemapGridType } from "./grid.js";
import { ElemapContent } from "./content.js";
import { ContentArguments } from "../content.js";
import { ContentIds } from "../register.js";

export type MapTypeStrings = `${MapType}`;

type ElemapType<M> = 
  M extends "rectangle" ? RectangleMap :
  M extends "hexagon" ? HexagonMap :
  never;

export type ContentParameters = Omit<ContentArguments, 'ids'|'offset'> & {
  offset?: Position
};

export class Elemap<M extends MapTypeStrings = `${MapType.Rectangle}`> {
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
    this.demangle__addContent();
    this.demangle__contentById();
    this.demangle__contentByElement();

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

  public addContent(params: ContentParameters) : ElemapContent {
    return this.method__addContent(params);
  }
  private demangle__addContent() {
    demangleProperty(this, 'addContent', (params: ContentParameters) => this.method__addContent(params));
  }
  private method__addContent(params: ContentParameters) {
    return this._.addContent(params);
  }
  
  public contentById(ids: ContentIds) { return this.method__contentById(ids); }
  private demangle__contentById() {
    demangleProperty(this, 'contentById', (ids: ContentIds) => this.method__contentById(ids));
  }
  private method__contentById(ids: ContentIds) : ElemapContent|undefined {
    let content = this._.contentById(ids);
    if (content) {
      return new ElemapContent(content);
    }
    return undefined;
  }
  
  public contentByElement(element: HTMLElement) { return this.method__contentByElement(element); }
  private demangle__contentByElement() {
    demangleProperty(this, 'contentByElement', (element: HTMLElement) => this.method__contentByElement(element));
  }
  private method__contentByElement(element: HTMLElement) : ElemapContent|undefined {
    let content = this._.contentByElement(element);
    if (content) {
      return new ElemapContent(content);
    }
    return undefined;
  }
}

function method__import(snapshot: GridMapSnapshot) {
  return new Elemap(snapshot.type, snapshot);
}
demangleProperty(Elemap, 'import', method__import);