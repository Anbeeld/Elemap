import RectangleMap from "./rectangle/map.js";
import HexagonMap from "./hexagon/map.js";
import { UserStyle, userStyleToStyle } from "./style/set.js";
import { validateConfig } from "./config.js";
import { MapType } from "./utils.js";
import { AbstractMap } from "./map.js";

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
}