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
  private map: AbstractMap;

  constructor(configCustom: any, userStyle: UserStyle) {
    let config = validateConfig(configCustom);
    let style = userStyleToStyle(userStyle);

    if (config.type === MapType.Rectangle) {
      this.map = new RectangleMap(config, style);
    } else if (config.type === MapType.Hexagon) {
      this.map = new HexagonMap(config, style);
    }

    this["render"];
  }

  public render(container: HTMLElement) : void {
    this.map.render(container);
  }

  public tileByIndex(i: number, j: number) : ElemapTile|undefined {
    let tile = (this.map as AbstractGridMap<AbstractGrid<AbstractTile>>).grid.tileByIndex(i, j);
    if (tile) {
      return new ElemapTile(tile);
    }
    return undefined;
  }
}

class ElemapTile {
  private tile: AbstractTile;

  constructor(tile: AbstractTile) {
    this.tile = tile;
    this.tile;

    this["style"];
  }

  public style(decls: CustomTileStyleDecls) : void {
    this.tile.deviateStyle(decls);
  }
}