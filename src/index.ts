import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { Config } from "./utils.js";
import { UserStyle, userStyleToSurfaceStyleGroup } from "./style/set.js";
import { validateConfig } from "./config.js";
import { MapType } from "./utils.js";

export default class Elemap {
  constructor(config: Config, userStyle: UserStyle) {
    config = validateConfig(config);
    let style = userStyleToSurfaceStyleGroup(userStyle);

    if (config.type === MapType.Rectangle) {
      return new RectangleMap(config, style);
    } else if (config.type === MapType.Hexagon) {
      return new HexagonMap(config, style);
    }
  }
}