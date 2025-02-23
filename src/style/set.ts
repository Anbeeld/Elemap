import { SurfaceOuterStyleDecls, SurfaceInnerStyleDecls, SurfaceOuterStyle, SurfaceInnerStyle } from "./surface.js";
import { GridOuterStyle, GridInnerStyle, GridOuterStyleDecls, GridInnerStyleDecls } from "./grid.js";
import { TileOuterStyle, TileInnerStyle, TileOuterStyleDecls, TileInnerStyleDecls, TileContourStyle, TileContourStyleDecls } from "./tile.js";

/* STYLE SETS */

export type SurfaceOuterStyleSet = {
  regular: SurfaceOuterStyle,
};
export type SurfaceInnerStyleSet = {
  regular: SurfaceInnerStyle,
};
export type SurfaceStyleSet = {
  outer: SurfaceOuterStyleSet,
  inner: SurfaceInnerStyleSet,
}

export type GridOuterStyleSet = {
  regular: GridOuterStyle,
};
export type GridInnerStyleSet = {
  regular: GridInnerStyle,
};
export type GridStyleSet = {
  outer: GridOuterStyleSet,
  inner: GridInnerStyleSet,
}

export type TileOuterStyleSet = {
  regular: TileOuterStyle,
  hover: TileOuterStyle
};
export type TileInnerStyleSet = {
  regular: TileInnerStyle,
  hover: TileInnerStyle
};
export type TileContourStyleSet = {
  hover: TileContourStyle
}
export type TileStyleSet = {
  outer: TileOuterStyleSet,
  inner: TileInnerStyleSet,
  contour: TileContourStyleSet
}

/* STYLE GROUPS */

export type SurfaceStyleGroup = {
  self: SurfaceStyleSet,
  grid: GridStyleGroup
}
export type GridStyleGroup = {
  self: GridStyleSet,
  tile: TileStyleSet
}

/* STYLE DECLS SETS */

export type SurfaceOuterStyleDeclsSet = {
  regular: SurfaceOuterStyleDecls
}
export type SurfaceInnerStyleDeclsSet = {
  regular: SurfaceInnerStyleDecls
}
export type SurfaceStyleDeclsSet = {
  outer: SurfaceOuterStyleDeclsSet,
  inner: SurfaceInnerStyleDeclsSet
}

export type GridOuterStyleDeclsSet = {
  regular: GridOuterStyleDecls,
}
export type GridInnerStyleDeclsSet = {
  regular: GridInnerStyleDecls,
}
export type GridStyleDeclsSet = {
  outer: GridOuterStyleDeclsSet,
  inner: GridInnerStyleDeclsSet
}

export type TileOuterStyleDeclsSet = {
  regular: TileOuterStyleDecls,
  hover: TileOuterStyleDecls,
}
export type TileInnerStyleDeclsSet = {
  regular: TileInnerStyleDecls,
  hover: TileInnerStyleDecls,
}
export type TileContourStyleDeclsSet = {
  hover: TileContourStyleDecls
}
export type TileStyleDeclsSet = {
  outer: TileOuterStyleDeclsSet,
  inner: TileInnerStyleDeclsSet,
  contour: TileContourStyleDeclsSet
}

/* STYLE DECLS GROUPS */

export type SurfaceStyleDeclsGroup = {
  self: SurfaceStyleDeclsSet,
  grid: GridStyleDeclsGroup
}
export type GridStyleDeclsGroup = {
  self: GridStyleDeclsSet,
  tile: TileStyleDeclsSet
}

/* USER STYLE */

export type UserStyle = {
  surface?: SurfaceStyleDeclsSet,
  grid?: GridStyleDeclsSet,
  tile?: TileStyleDeclsSet
}

export const defaultSurfaceStyleDeclsGroup: SurfaceStyleDeclsGroup = {
  self: {
    outer: {
      regular: {
        padding: '50px',
        background: {
          color: '#f5df8d',
        },
        custom: ''
      }
    },
    inner: {
      regular: {
        borderRadius: '0px',
        custom: ''
      }
    },
  },
  grid: {
    self: {
      outer: {
        regular: {
          spacing: '4px',
          borderRadius: '6px',
          custom: ''
        }
      },
      inner: {
        regular: {
          width: '100px',
          height: '100px',
          borderRadius: '6px',
          custom: ''
        }
      }
    },
    tile: {
      outer: {
        regular: {
          background: {
            color: '#222222',
          },
          custom: ''
        },
        hover: {
          background: {
            color: '#f5f5f5',
          },
          custom: ''
        }
      },
      inner: {
        regular: {
          background: {
            color: '#b2e090',
          },
          custom: ''
        },
        hover: {
          custom: ''
        }
      },
      contour: {
        hover: {
          width: '2px',
          background: {color: '#f5f5f5'},
          custom: ''
        }
      }
    }
  }
}

// Based on https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      // Only if the key exists in the target object
      if (!target.hasOwnProperty(key)) { 
        continue;
      }
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function userStyleToSurfaceStyleGroup(style: UserStyle) : SurfaceStyleGroup {
  let styleDecls = {
    self: style.surface || {},
    grid: {
      self: style.grid || {},
      tile: style.tile || {}
    }
  }

  return transformSurfaceStyleDeclsToGroup(validateSurfaceStyleDeclsGroup(styleDecls));
}

export function validateSurfaceStyleDeclsGroup(style: any) : SurfaceStyleDeclsGroup {
  return mergeDeep(defaultSurfaceStyleDeclsGroup, style);
}

export function transformSurfaceStyleDeclsToGroup(style: SurfaceStyleDeclsGroup) : SurfaceStyleGroup {
  let surfaceStyleGroup: SurfaceStyleGroup = {
    self: {
      outer: {
        regular: new SurfaceOuterStyle(style.self.outer.regular),
      },
      inner: {
        regular: new SurfaceInnerStyle(style.self.inner.regular),
      },
    },
    grid: {
      self: {
        outer: {
          regular: new GridOuterStyle(style.grid.self.outer.regular),
        },
        inner: {
          regular: new GridInnerStyle(style.grid.self.inner.regular),
        }
      },
      tile: TileStyleSetFromDecls(style.grid.tile)
    }
  }

  return surfaceStyleGroup;
}

export function TileStyleSetFromDecls(style: TileStyleDeclsSet) : TileStyleSet {
  let set = {
    outer: {
      regular: new TileOuterStyle(style.outer.regular),
      hover: new TileOuterStyle(style.outer.regular)
    },
    inner: {
      regular: new TileInnerStyle(style.inner.regular),
      hover: new TileInnerStyle(style.inner.regular)
    },
    contour: {
      hover: new TileContourStyle(style.contour.hover)
    }
  }

  // Hover is created based on regular style, then hover styles overwrite them
  set.outer.hover.setProps(style.outer.hover);
  set.inner.hover.setProps(style.inner.hover);

  return set;
}

export function TileStyleSetToDecls(style: TileStyleSet) : TileStyleDeclsSet {
  return {
    outer: {
      regular: style.outer.regular.decls,
      hover: style.outer.hover.decls
    },
    inner: {
      regular: style.inner.regular.decls,
      hover: style.inner.hover.decls
    },
    contour: {
      hover: style.contour.hover.decls
    }
  }
}