import { GridOrientation, GridOffset, Size, getProperty } from "./utils.js";

export type CustomConfig = {
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
  size: Size
  grid: {
    orientation: GridOrientation,
    offset: GridOffset
  }
};

export function validateConfig(custom: CustomConfig) : Config {
  return {
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