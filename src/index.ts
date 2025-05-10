import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls, CustomGridMapStyleSchema, modifyGridMapStyleSchema } from "./style/schema.js";
import { validateConfig } from "./config.js";
import { MapType } from "./utils.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import { AbstractGrid } from "./grid.js";
import { AbstractTile } from "./tile.js";
// import { AbstractTile } from "./tile.js";

export default class Elemap {
  private _: AbstractMap;

  constructor(configCustom: any, CustomGridMapStyleSchema: CustomGridMapStyleSchema) {
    let config = validateConfig(configCustom);
    let style = modifyGridMapStyleSchema(CustomGridMapStyleSchema);

    if (config.type === MapType.Rectangle) {
      this._ = new RectangleMap(config, style);
    } else if (config.type === MapType.Hexagon) {
      this._ = new HexagonMap(config, style);
    }

    // Shielding from mangling through "keep_quoted: true"
    this["_"];
    this["render"];
    this["tileByIndex"];
  }

  public render(container: HTMLElement) : void {
    this._.render(container);
  }

  public tileByIndex(i: number, j: number) : ElemapTile|undefined {
    let tile = (this._ as AbstractGridMap<AbstractGrid<AbstractTile>>).grid.tileByIndex(i, j);
    if (tile) {
      return new ElemapTile(tile);
    }
    return undefined;
  }
}

class ElemapTile {
  private _: AbstractTile;

  constructor(map: AbstractTile) {
    this._ = map;

    // Shielding from mangling through "keep_quoted: true"
    this["_"];
    this["updateStyle"];
  }

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(decls, replace);
  }
}