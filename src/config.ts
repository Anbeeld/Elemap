import { MapType, GridOrientation, GridOffset, Config, copyUnshieldedToShielded } from "./utils.js";

export function validateConfig(configCustom: any) : Config {
  let configDefault = {
    $type: MapType.Rectangle,
    $size: {
      $width: 32,
      $height: 18
    },
    $grid: {
      $orientation: GridOrientation.Pointy,
      $offset: GridOffset.Odd
    }
  };

  copyUnshieldedToShielded(configDefault, configCustom);

  return {
    type: configDefault.$type,
    size: {
      width: configDefault.$size.$width,
      height: configDefault.$size.$height
    },
    grid: {
      orientation: configDefault.$grid.$orientation,
      offset: configDefault.$grid.$offset
    }
  };
}