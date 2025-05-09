/* STYLE SETS */

import { copyUnshieldedToShielded } from "../utils.js";

export type StyleDecl = string;

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
  outer?: string,
  inner?: string,
  hover?: {
    outer?: string,
    inner?: string,
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
      contour: 'border: 2px solid transparent;background-color:#f5f5f5;',
    },
    tile: {
      outer: 'border-radius:6px;background-color:#222222;',
      inner: 'width:100px;height:100px;border-radius:6px;background-color:#b2e090;margin:2px;',
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
      outer: defaultStyle.map.outer + customStyle.$map.$outer,
      inner: defaultStyle.map.inner + customStyle.$map.$inner
    },
    grid: {
      frame: defaultStyle.grid.frame + customStyle.$grid.$frame,
      contour: defaultStyle.grid.contour + customStyle.$grid.$contour,
    },
    tile: {
      outer: defaultStyle.tile.outer + customStyle.$tile.$outer,
      inner: defaultStyle.tile.inner + customStyle.$tile.$inner,
      hover: {
        outer: defaultStyle.tile.hover.outer + customStyle.$tile.$hover.$outer,
        inner: defaultStyle.tile.hover.inner + customStyle.$tile.$hover.$inner,
      }
    }
  }
}






const initialTileStyle: TileStyleDecls = {
  outer: '',//'border-radius:6px;background-color:#222222;',,
  inner: '',//'width:100px;height:100px;border-radius:6px;background-color:#b2e090;',,
  hover: {
    outer: '',//'background-color:#f5f5f5;',,
    inner: '',
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
    outer: initial.outer + shielded.$outer,
    inner: initial.inner + shielded.$inner,
    hover: {
      outer: initial.hover.outer + shielded.$hover.$outer,
      inner: initial.hover.inner + shielded.$hover.$inner,
    }
  }
}