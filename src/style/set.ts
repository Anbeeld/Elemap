/* STYLE SETS */

import { copyUnshieldedToShielded } from "../utils.js";

export type StyleDecl = {
  default: string,
  custom: string
}

export type StyleDecls = {
  map: MapStyleDecls,
  grid: GridStyleDecls,
  tile: TileStyleDecls
}
export type UserStyle = {
  map?: MapStyleDecls,
  grid?: GridStyleDecls,
  tile?: TileStyleDecls
}

export type MapStyleDecls = {
  outer: StyleDecl,
  inner: StyleDecl,
}

export type GridStyleDecls = {
  frame: StyleDecl,
  spacing: StyleDecl,
  contour: StyleDecl
}

export type TileStyleDecls = {
  outer: StyleDecl,
  inner: StyleDecl,
  hover: {
    outer: StyleDecl,
    inner: StyleDecl,
  }
}
export type CustomTileStyleDecls = {
  outer?: StyleDecl,
  inner?: StyleDecl,
  hover?: {
    outer?: StyleDecl,
    inner?: StyleDecl,
  }
}

export function userStyleToStyle(userStyle: UserStyle) : StyleDecls {
  let defaultStyle = {
    map: {
      outer: 'padding:50px;background-color:#f5df8d;',
      inner: 'border-radius:0;',
    },
    grid: {
      frame: 'background-color:#222222;',
      spacing: '4px',
      contour: 'border: 2px solid transparent;background-color:#f5f5f5;',
    },
    tile: {
      outer: 'border-radius:6px;background-color:#222222;',
      inner: 'width:100px;height:100px;border-radius:6px;background-color:#b2e090;',
      hover: {
        outer: 'background-color:#f5f5f5;',
        inner: '',
      }
    }
  }

  let customStyle = {
    $map: {
      $outer: '',
      $inner: '',
    },
    $grid: {
      $frame: '',
      $spacing: '',
      $contour: '',
    },
    $tile: {
      $outer: '',
      $inner: '',
      $hover: {
        $outer: '',
        $inner: '',
      }
    }
  }

  copyUnshieldedToShielded(customStyle, userStyle, false);

  return {
    map: {
      outer: {
        default: defaultStyle.map.outer,
        custom: customStyle.$map.$outer
      },
      inner: {
        default: defaultStyle.map.inner,
        custom: customStyle.$map.$inner
      }
    },
    grid: {
      frame: {
        default: defaultStyle.grid.frame,
        custom: customStyle.$grid.$frame
      },
      spacing: {
        default: defaultStyle.grid.spacing,
        custom: customStyle.$grid.$spacing
      },
      contour: {
        default: defaultStyle.grid.contour,
        custom: customStyle.$grid.$contour
      },
    },
    tile: {
      outer: {
        default: defaultStyle.tile.outer,
        custom: customStyle.$tile.$outer,
      },
      inner: {
        default: defaultStyle.tile.inner,
        custom: customStyle.$tile.$inner,
      },
      hover: {
        outer: {
          default: defaultStyle.tile.hover.outer,
          custom: customStyle.$tile.$hover.$outer,
        },
        inner: {
          default: defaultStyle.tile.hover.inner,
          custom: customStyle.$tile.$hover.$inner,
        },
      }
    }
  }
}






const initialTileStyle: TileStyleDecls = {
  outer: {
    default: 'border-radius:6px;background-color:#222222;',
    custom: ''
  },
  inner: {
    default: 'width:100px;height:100px;border-radius:6px;background-color:#b2e090;',
    custom: ''
  },
  hover: {
    outer: {
      default: 'background-color:#f5f5f5;',
      custom: ''
    },
    inner: {
      default: '',
      custom: ''
    },
  }
}

export function addCustomTileStyleToDefault(unshielded: CustomTileStyleDecls, initial = initialTileStyle) : TileStyleDecls {
  let shielded = {
    $outer: '',
    $inner: '',
    $hover: {
      $outer: '',
      $inner: '',
    }
  }

  copyUnshieldedToShielded(shielded, unshielded, false);

  return {
    outer: {
      default: initial.outer.default,
      custom: initial.outer.custom + shielded.$outer,
    },
    inner: {
      default: initial.inner.default,
      custom: initial.inner.custom + shielded.$inner,
    },
    hover: {
      outer: {
        default: initial.hover.outer.default,
        custom: initial.hover.outer.custom + shielded.$hover.$outer,
      },
      inner: {
        default: initial.hover.inner.default,
        custom: initial.hover.inner.custom + shielded.$hover.$inner,
      },
    }
  }
}