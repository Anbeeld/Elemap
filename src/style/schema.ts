import { unshieldProperty } from "../utils.js"

function getDelcsProperty(decls: object, name: string) : string|undefined {
  let value = unshieldProperty(decls, name);
  if (typeof value === 'string') {
    return value;
  }
  return undefined;
}

/* MAP STYLE DECLARATION TYPES */
export type MapStyleDecls = {
  outer: string,
  inner: string
}
type CustomMapStyleDecls = {
  outer?: string,
  inner?: string
}

/* MAP STYLE DECLARATION CONSTANTS */
const defaultMapStyleDecls: MapStyleDecls = {
  outer: 'padding:50px;background-color:#f5df8d;',
  inner: '',
};

/* MAP STYLE DECLARATIONS MODIFICATION */
function modifyMapStyleDecls(custom: CustomMapStyleDecls, initial?: MapStyleDecls) : MapStyleDecls {
  return {
    outer: 
      (initial && initial.outer ? initial.outer : '') +
      (getDelcsProperty(custom, 'outer') || ''),
    inner:
      (initial && initial.inner ? initial.inner : '') +
      (getDelcsProperty(custom, 'inner') || '')
  }
}

/* GRID STYLE DECLARATION TYPES */
export type GridStyleDecls = {
  frame: string,
  contour: string
}
type CustomGridStyleDecls = {
  frame?: string,
  contour?: string
}

/* GRID STYLE DECLARATION CONSTANTS */
const defaultGridStyleDecls: GridStyleDecls = {
  frame: 'background-color:#222222;',
  contour: 'border: 2px solid transparent;background-color:#f5f5f5;',
};

/* GRID STYLE DECLARATIONS MODIFICATION */
function modifyGridStyleDecls(custom: CustomGridStyleDecls, initial?: GridStyleDecls) : GridStyleDecls {
  return {
    frame:
      (initial && initial.frame ? initial.frame : '') +
      (getDelcsProperty(custom, 'frame') || ''),
    contour:
      (initial && initial.contour ? initial.contour : '') +
      (getDelcsProperty(custom, 'contour') || '')
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
export type CustomTileStyleDecls = {
  outer?: string,
  inner?: string,
  hover?: {
    outer?: string,
    inner?: string,
  }
}

/* TILE STYLE DECLARATIONS CONSTANTS */
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
  return {
    outer:
      (initial && initial.outer ? initial.outer : '') +
      (getDelcsProperty(custom, 'outer') || ''),
    inner:
      (initial && initial.inner ? initial.inner : '') +
      (getDelcsProperty(custom, 'inner') || ''),
    hover: {
      outer:
        (initial && initial.hover && initial.hover.outer ? initial.hover.outer : '') +
        (getDelcsProperty(unshieldProperty(custom, 'hover'), 'outer') || ''),
      inner:
        (initial && initial.hover && initial.hover.inner ? initial.hover.inner : '') +
        (getDelcsProperty(unshieldProperty(custom, 'hover'), 'inner') || ''),
    }
  }
}

/* GRID STYLE SCHEMA TYPES */
export type GridStyleSchema = {
  grid: GridStyleDecls,
  tile: TileStyleDecls
}

/* GRID MAP STYLE SCHEMA TYPES */
export type GridMapStyleSchema = {
  map: MapStyleDecls
} & GridStyleSchema;
type CustomGridMapStyleSchema = {
  map?: MapStyleDecls,
  grid?: GridStyleDecls,
  tile?: TileStyleDecls
}

/* GRID MAP STYLE SCHEMA MODIFICATION */
export function modifyGridMapStyleSchema(custom: CustomGridMapStyleSchema) : GridMapStyleSchema {
  return {
    map: modifyMapStyleDecls(unshieldProperty(custom, 'map') || {}, defaultMapStyleDecls),
    grid: modifyGridStyleDecls(unshieldProperty(custom, 'grid') || {}, defaultGridStyleDecls),
    tile: modifyTileStyleDecls(unshieldProperty(custom, 'tile') || {}, defaultTileStyleDecls),
  }
}

export type CustomSchema = CustomGridMapStyleSchema;