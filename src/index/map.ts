import RectangleMap from "../rectangle/map.js";
import HexagonMap from "../hexagon/map.js";
import { Config, configToGridMapArguments } from "../config.js";
import { Extensions, ArrayOfExtensions, GridOffset, GridOrientation, MapType, Position, prepareExtensionsInput } from "../utils.js";
import { GridMapSnapshot } from "../map.js";
import { AccessCoords, ElemapGrid, ElemapGridType } from "./grid.js";
import { ElemapContent } from "./content.js";
import { ContentIds } from "../registry.js";
import { ElemapTile } from "./tile.js";
import { demangleMapIds } from "../mangle.js";

type ElemapType<M> = 
  M extends MapType.Rectangle ? RectangleMap :
  M extends MapType.Hexagon ? HexagonMap :
  never;

export type ContentParameters<M extends MapType = MapType.Rectangle> = {
  figure: HTMLElement|string,
  location?: ElemapTile<M>|ElemapContent|AccessCoords<M>|[number, number],
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
  }

  public get ids() {
    return demangleMapIds(this._.ids);
  }

  public static import(snapshot: GridMapSnapshot) {
    return new Elemap(snapshot.type, snapshot);
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
  
  public render(container: HTMLElement) : void {
    this._.render(container);
  }

  public get grid() : ElemapGrid<M>|undefined {
    let grid = this._.grid;
    if (grid) {
      return new ElemapGrid<M>(grid as ElemapGridType<M>);
    }
    return undefined;
  }

  public addContent(params: ContentParameters<M>) {
    return this._.addContent<M>(params);
  }

  public deleteContent(content: ContentIds|HTMLElement) : boolean {
    return this._.deleteContent(content);
  }
  
  public contentById(ids: ContentIds) : ElemapContent|undefined {
    let content = this._.contentById(ids);
    if (content) {
      return new ElemapContent(content);
    }
    return undefined;
  }
  
  public contentByElement(element: HTMLElement) : ElemapContent|undefined {
    let content = this._.contentByElement(element);
    if (content) {
      return new ElemapContent(content);
    }
    return undefined;
  }
    
  public get contents() : ElemapContent[] {
    let contents = [];
    for (let content of this._.contents) {
      contents.push(new ElemapContent(content));
    }
    return contents;
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