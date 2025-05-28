import { GridOrientation, GridOffset, Size, getProperty } from "./utils.js";

export type CustomConfig = {
  grid?: {
    size?: {
      width?: number,
      height?: number
    },
    orientation?: GridOrientation,
    offset?: GridOffset
  }
};

export type Config = {
  grid: {
    size: Size
    orientation: GridOrientation,
    offset: GridOffset
  }
};

export function validateConfig(custom: CustomConfig) : Config {
  return {
    grid: {
      size: {
        width: getProperty(getProperty(custom, 'size'), 'width') || 32,
        height: getProperty(getProperty(custom, 'size'), 'height') || 18
      },
      orientation: getProperty(getProperty(custom, 'grid'), 'orientation') || GridOrientation.Pointy,
      offset: getProperty(getProperty(custom, 'grid'), 'offset') || GridOffset.Odd
    }
  };
}