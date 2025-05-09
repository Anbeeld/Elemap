import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls, UserStyle, userStyleToStyle } from "./style/set.js";
import { validateConfig } from "./config.js";
import { MapType } from "./utils.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import { AbstractGrid } from "./grid.js";
import { AbstractTile } from "./tile.js";
// import { AbstractTile } from "./tile.js";

export default class Elemap {
  private _: AbstractMap;

  constructor(configCustom: any, userStyle: UserStyle) {
    let config = validateConfig(configCustom);
    let style = userStyleToStyle(userStyle);

    if (config.type === MapType.Rectangle) {
      this._ = new RectangleMap(config, style);
    } else if (config.type === MapType.Hexagon) {
      this._ = new HexagonMap(config, style);
    }

    this["_"];
    this["render"];
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

    this["_"];
    this["updateStyle"];
  }

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    this._.updateStyle(decls, replace);
  }
}