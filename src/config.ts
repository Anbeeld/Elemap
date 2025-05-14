import { MapType, GridOrientation, GridOffset, Size, getProperty } from "./utils.js";

export type CustomConfig = {
  type?: MapType,
  size?: {
    width?: number,
    height?: number
  },
  grid?: {
    orientation?: GridOrientation,
    offset?: GridOffset
  }
};

export type Config = {
  type: MapType,
  size: Size
  grid: {
    orientation: GridOrientation,
    offset: GridOffset
  }
};

export function validateConfig(custom: CustomConfig) : Config {
  return {
    type: getProperty(custom, 'type') || MapType.Rectangle,
    size: {
      width: getProperty(getProperty(custom, 'size'), 'width') || 32,
      height: getProperty(getProperty(custom, 'size'), 'height') || 18
    },
    grid: {
      orientation: getProperty(getProperty(custom, 'grid'), 'orientation') || GridOrientation.Pointy,
      offset: getProperty(getProperty(custom, 'grid'), 'offset') || GridOffset.Odd
    }
  };
}