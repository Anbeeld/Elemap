import RectangleMap from "../rectangle/map.js";
import HexagonMap from "../hexagon/map.js";
import { Config, configToGridMapArguments } from "../config.js";
import { Extensions, GridOffset, GridOrientation, MapType, Position } from "../utils.js";
import { GridMapSnapshot } from "../map.js";
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

  public extend(extension: Extensions) {
    return this._.extend(extension);
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

  public addContent(params: ContentParameters) {
    return this._.addContent(params);
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