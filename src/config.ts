import { MapType, GridOrientation, GridOffset, Config } from "./utils.js";

export function validateConfig(config: Config) : Config {
  if (!config.type) {
    config.type = MapType.Rectangle;
  }
  if (!config.size) {
    config.size = {width: 50, height: 50};
  }
  if (!config.grid) {
    config.grid = {};
  }
  if (!config.grid.orientation) {
    config.grid.orientation = GridOrientation.Pointy;
  }
  if (!config.grid.offset) {
    config.grid.offset = GridOffset.Odd;
  }
  return config;
}