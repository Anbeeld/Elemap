import RectangleMap from "../rectangle/map.js";
import HexagonMap from "../hexagon/map.js";
import { Config, configToGridMapArguments } from "../config.js";
import { GridOffset, GridOrientation, MapType, Position } from "../utils.js";
import { demangleProperty } from "../mangle.js";
import { GridMapExtension, GridMapSnapshot } from "../map.js";
import { ElemapGrid, ElemapGridType } from "./grid.js";
import { ElemapContent } from "./content.js";
import { ContentArguments } from "../content.js";
import { ContentIds } from "../registry.js";

type ElemapType<M> = 
  M extends MapType.Rectangle ? RectangleMap :
  M extends MapType.Hexagon ? HexagonMap :
  never;

export type ContentParameters = Omit<ContentArguments, 'ids'|'offset'> & {
  offset?: Position
};

export class Elemap<M extends MapType = MapType.Rectangle> {
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
    this.demangle__extensions();
    this.demangle__render();
    this.demangle__extend();
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

  public set extensions(value: any) { value; }
  public get extensions() : Extensions { return this.method__extensions(); }
  private demangle__extensions() {
    demangleProperty(this, 'extensions', {
      set: (value: any) => { value; },
      get: () => this.method__extensions()
    });
  }
  private method__extensions() {
    return this._.extensions;
  }

  public extend(extension: GridMapExtension) : void {
    return this.method__extend(extension);
  }
  private demangle__extend() {
    demangleProperty(this, 'extend', (extension: GridMapExtension) => this.method__extend(extension));
  }
  private method__extend(extension: GridMapExtension) {
    return this._.extend(extension);
  }
  
  public render(container: HTMLElement) { this.method__render(container); }
  private demangle__render() {
    demangleProperty(this, 'render', (container: HTMLElement) => this.method__render(container));
  }
  private method__render(container: HTMLElement) : void {
    this._.render(container);
  }

  public set grid(value: any) { value; }
  public get grid() : ElemapGrid<M>|undefined { return this.method__grid(); }
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

  // For TypeScript - exporting enums as get methods
  public static get MapType() {
    return {
      Rectangle: MapType.Rectangle,
      Hexagon: MapType.Hexagon
    }
  }
  public static get GridOrientation() {
    return {
      Pointy: GridOrientation.Pointy,
      Flat: GridOrientation.Flat
    }
  }
  public static get GridOffset() {
    return {
      Odd: GridOffset.Odd,
      Even: GridOffset.Even
    }
  }
}

function method__import(snapshot: GridMapSnapshot) {
  return new Elemap(snapshot.type, snapshot);
}
demangleProperty(Elemap, 'import', method__import);