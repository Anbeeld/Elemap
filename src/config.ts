import { MapType, GridOrientation, GridOffset, Config } from "./utils.js";

export function validateConfig(custom: any) : Config {
  return {
    type: custom['type'] ? custom['type'] : MapType.Rectangle,
    size: {
      width: custom['size'] && custom['size']['width'] ? custom['size']['width'] : 32,
      height: custom['size'] && custom['size']['height'] ? custom['size']['height'] : 18
    },
    grid: {
      orientation: custom['grid'] && custom['grid']['orientation'] ? custom['grid']['orientation'] : GridOrientation.Pointy,
      offset: custom['grid'] && custom['grid']['offset'] ? custom['grid']['offset'] : GridOffset.Odd
    }
  };
}