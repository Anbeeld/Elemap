import { GridOrientation, GridOffset, Size, unshieldProperty } from "./utils.js";

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
        width: unshieldProperty(unshieldProperty(custom, 'size'), 'width') || 32,
        height: unshieldProperty(unshieldProperty(custom, 'size'), 'height') || 18
      },
      orientation: unshieldProperty(unshieldProperty(custom, 'grid'), 'orientation') || GridOrientation.Pointy,
      offset: unshieldProperty(unshieldProperty(custom, 'grid'), 'offset') || GridOffset.Odd
    }
  };
}