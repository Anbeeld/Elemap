import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls, CustomSchema, modifyGridMapStyleSchema } from "./style/schema.js";
import { CustomConfig, validateConfig } from "./config.js";
import { MapType, shieldProperty } from "./utils.js";
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

  constructor(type?: M, config?: CustomConfig, schema?: CustomSchema) {
    let validatedType = type === MapType.Rectangle ? MapType.Rectangle : (type === MapType.Hexagon ? MapType.Hexagon : MapType.Rectangle);
    let validatedConfig = validateConfig(config || {});
    let validatedSchema = modifyGridMapStyleSchema(schema || {});

    if (validatedType === MapType.Rectangle) {
      this._ = new RectangleMap({
        ids: undefined,
        grid: {
          ids: undefined,
          size: validatedConfig.grid.size,
          orientation: validatedConfig.grid.orientation,
          offset: validatedConfig.grid.offset,
          schema: false
        },
        schema: validatedSchema
      }) as ElemapType<M>;
    } else if (validatedType === MapType.Hexagon) {
      this._ = new HexagonMap({
        ids: undefined,
        grid: {
          ids: undefined,
          size: validatedConfig.grid.size,
          orientation: validatedConfig.grid.orientation,
          offset: validatedConfig.grid.offset,
          schema: false
        },
        schema: validatedSchema
      }) as ElemapType<M>;
    }

    // For JavaScript - shield method names from mangling
    this.shield__export();
    this.shield__render();
    this.shield__tileByIndex();
  }

  public static import(snapshot: GridMapSnapshot) {
    return method__import(snapshot);
  }

  public export() {
    return this.method__export();
  }
  private shield__export() {
    shieldProperty(this, 'export', () => this.method__export());
  }
  private method__export() {
    return this._.export();
  }
  
  public render(container: HTMLElement) { this.method__render(container); }
  private shield__render() {
    shieldProperty(this, 'render', (container: HTMLElement) => this.method__render(container));
  }
  private method__render(container: HTMLElement) : void {
    this._.render(container);
  }

  public tileByIndex(i: number, j: number) { return this.method__tileByIndex(i, j); }
  private shield__tileByIndex() {
    shieldProperty(this, 'tileByIndex', (i: number, j: number) => this.method__tileByIndex(i, j));
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
  if (snapshot.type === MapType.Rectangle) {
    return RectangleMap.import(snapshot as any);
  } else if (snapshot.type === MapType.Hexagon) {
    return HexagonMap.import(snapshot as any);
  }
  throw new Error(`Unknown map type: ${snapshot.type}`);
}
shieldProperty(Elemap, 'import', method__import);

type ElemapTileType<M> = 
  M extends "rectangle" ? RectangleTile :
  M extends "hexagon" ? HexagonTile :
  never;

class ElemapTile<M extends MapTypeStrings> {
  private _: ElemapTileType<M>;

  constructor(tile: ElemapTileType<M>) {
    this._ = tile;

    // For JavaScript - shield method names from mangling
    this.shield__updateStyle();
  }

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this.method__updateStyle(decls, replace);
  }
  private shield__updateStyle() {
    shieldProperty(this, 'updateStyle', (decls: CustomTileStyleDecls, replace: boolean = false) => this.method__updateStyle(decls, replace));
  }
  private method__updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(decls, replace);
  }
}