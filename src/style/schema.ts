import { copyUnshieldedToShielded } from "../utils.js";

/* MAP STYLE DECLARATION TYPES */
export type MapStyleDecls = {
  outer: string,
  inner: string
}
type ShieldedMapStyleDecls = {
  $outer: string,
  $inner: string
}
type CustomMapStyleDecls = {
  outer?: string,
  inner?: string
}

/* MAP STYLE DECLARATION CONSTANTS */
const shieldedMapStyleDecls: ShieldedMapStyleDecls = {
  $outer: '',
  $inner: '',
};
const defaultMapStyleDecls: MapStyleDecls = {
  outer: 'padding:50px;background-color:#f5df8d;',
  inner: '',
};

/* MAP STYLE DECLARATIONS MODIFICATION */
function modifyMapStyleDecls(custom: CustomMapStyleDecls, initial?: MapStyleDecls) : MapStyleDecls {
  let shielded = shieldedMapStyleDecls;

  copyUnshieldedToShielded(shielded, custom, false);

  return {
    outer: initial && initial.outer ? initial.outer + shielded.$outer : shielded.$outer,
    inner: initial && initial.inner ? initial.inner + shielded.$inner : shielded.$inner
  }
}

/* GRID STYLE DECLARATION TYPES */
export type GridStyleDecls = {
  frame: string,
  contour: string
}
type ShieldedGridStyleDecls = {
  $frame: string,
  $contour: string
}
type CustomGridStyleDecls = {
  frame?: string,
  contour?: string
}

/* GRID STYLE DECLARATION CONSTANTS */
const shieldedGridStyleDecls: ShieldedGridStyleDecls = {
  $frame: '',
  $contour: '',
};
const defaultGridStyleDecls: GridStyleDecls = {
  frame: 'background-color:#222222;',
  contour: 'border: 2px solid transparent;background-color:#f5f5f5;',
};

/* GRID STYLE DECLARATIONS MODIFICATION */
function modifyGridStyleDecls(custom: CustomGridStyleDecls, initial?: GridStyleDecls) : GridStyleDecls {
  let shielded = shieldedGridStyleDecls;

  copyUnshieldedToShielded(shielded, custom, false);

  return {
    frame: initial && initial.frame ? initial.frame + shielded.$frame : shielded.$frame,
    contour: initial && initial.contour ? initial.contour + shielded.$contour : shielded.$contour
  }
}

/* TILE STYLE DECLARATIONS TYPES */
export type TileStyleDecls = {
  outer: string,
  inner: string,
  hover: {
    outer: string,
    inner: string,
  }
}
type ShieldedTileStyleDecls = {
  $outer: string,
  $inner: string,
  $hover: {
    $outer: string,
    $inner: string,
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

/* TILE STYLE DECLARATIONS CONSTANTS */
const shieldedTileStyleDecls: ShieldedTileStyleDecls = {
  $outer: '',
  $inner: '',
  $hover: {
    $outer: '',
    $inner: '',
  }
}
const defaultTileStyleDecls: TileStyleDecls = {
  outer: 'background-color:#222222;',
  inner: 'width:100px;height:100px;border-radius:6px;background-color:#b2e090;margin:2px;',
  hover: {
    outer: 'background-color:#f5f5f5;',
    inner: '',
  }
}

/* TILE STYLE DECLARATIONS MODIFICATION */
export function modifyTileStyleDecls(custom: CustomTileStyleDecls, initial?: TileStyleDecls) : TileStyleDecls {
  let shielded = shieldedTileStyleDecls;

  copyUnshieldedToShielded(shielded, custom, false);

  return {
    outer: initial && initial.outer ? initial.outer + shielded.$outer : shielded.$outer,
    inner: initial && initial.inner ? initial.inner + shielded.$inner : shielded.$inner,
    hover: {
      outer: initial && initial.hover && initial.hover.outer ? initial.hover.outer + shielded.$hover.$outer : shielded.$hover.$outer,
      inner: initial && initial.hover && initial.hover.inner ? initial.hover.inner + shielded.$hover.$inner : shielded.$hover.$inner,
    }
  }
}

/* GRID MAP STYLE SCHEMA TYPES */
export type GridMapStyleSchema = {
  map: MapStyleDecls,
  grid: GridStyleDecls,
  tile: TileStyleDecls
}
type ShieldedGridMapStyleSchema = {
  $map: ShieldedMapStyleDecls,
  $grid: ShieldedGridStyleDecls,
  $tile: ShieldedTileStyleDecls
}
export type CustomGridMapStyleSchema = {
  map?: MapStyleDecls,
  grid?: GridStyleDecls,
  tile?: TileStyleDecls
}

/* GRID MAP STYLE SCHEMA CONSTANTS */
const shieldedGridMapStyleSchema: ShieldedGridMapStyleSchema = {
  $map: shieldedMapStyleDecls,
  $grid: shieldedGridStyleDecls,
  $tile: shieldedTileStyleDecls
}

/* GRID MAP STYLE SCHEMA MODIFICATION */
export function modifyGridMapStyleSchema(custom: CustomGridMapStyleSchema) : GridMapStyleSchema {
  let shielded = shieldedGridMapStyleSchema;

  copyUnshieldedToShielded(shielded, custom, false);

  return {
    map: modifyMapStyleDecls(shielded.$map as unknown as MapStyleDecls || {}, defaultMapStyleDecls),
    grid: modifyGridStyleDecls(shielded.$grid as unknown as GridStyleDecls || {}, defaultGridStyleDecls),
    tile: modifyTileStyleDecls(shielded.$tile as unknown as TileStyleDecls || {}, defaultTileStyleDecls),
  }
}
