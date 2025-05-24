import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { CustomTileStyleDecls, CustomSchema, modifyGridMapStyleSchema } from "./style/schema.js";
import { CustomConfig, validateConfig } from "./config.js";
import { MapType, setProperty } from "./utils.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import { AbstractTile } from "./tile.js";
// import { AbstractTile } from "./tile.js";

export default class Elemap {
  private _: AbstractMap;

  constructor(config?: CustomConfig, schema?: CustomSchema) {
    let validatedConfig = validateConfig(config || {});
    let validatedSchema = modifyGridMapStyleSchema(schema || {});

    if (validatedConfig.type === MapType.Rectangle) {
      this._ = new RectangleMap(validatedConfig, validatedSchema);
    } else if (validatedConfig.type === MapType.Hexagon) {
      this._ = new HexagonMap(validatedConfig, validatedSchema);
    }

    setProperty(this, 'render', (container: HTMLElement) : void => {
      this._.render(container);
    });

    setProperty(this, 'tileByIndex', (i: number, j: number) : ElemapTile|undefined => {
      let tile = (this._ as AbstractGridMap).grid.tileByIndex(i, j);
      if (tile) {
        return new ElemapTile(tile);
      }
      return undefined;
    });
  }
}

class ElemapTile {
  private _: AbstractTile;

  constructor(map: AbstractTile) {
    this._ = map;

    setProperty(this, 'updateStyle', (decls: CustomTileStyleDecls, replace: boolean = false) : void => {
      this._.updateStyle(decls, replace);
    });
  }
}