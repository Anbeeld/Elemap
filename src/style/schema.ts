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
      (custom['outer'] ? custom['outer'] : ''),
    inner:
      (initial && initial.inner ? initial.inner : '') +
      (custom['inner'] ? custom['inner'] : '')
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
      (custom['frame'] ? custom['frame'] : ''),
    contour:
      (initial && initial.contour ? initial.contour : '') +
      (custom['contour'] ? custom['contour'] : '')
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
      (custom['outer'] ? custom['outer'] : ''),
    inner:
      (initial && initial.inner ? initial.inner : '') +
      (custom['inner'] ? custom['inner'] : ''),
    hover: {
      outer:
        (initial && initial.hover && initial.hover.outer ? initial.hover.outer : '') +
        (custom['hover'] && custom['hover']['outer'] ? custom['hover']['outer'] : ''),
      inner:
        (initial && initial.hover && initial.hover.inner ? initial.hover.inner : '') +
        (custom['hover'] && custom['hover']['inner'] ? custom['hover']['inner'] : '')
    }
  }
}

/* GRID MAP STYLE SCHEMA TYPES */
export type GridMapStyleSchema = {
  map: MapStyleDecls,
  grid: GridStyleDecls,
  tile: TileStyleDecls
}
export type CustomGridMapStyleSchema = {
  map?: MapStyleDecls,
  grid?: GridStyleDecls,
  tile?: TileStyleDecls
}

/* GRID MAP STYLE SCHEMA MODIFICATION */
export function modifyGridMapStyleSchema(custom: CustomGridMapStyleSchema) : GridMapStyleSchema {
  return {
    map: modifyMapStyleDecls(custom['map'] ? custom['map'] : {}, defaultMapStyleDecls),
    grid: modifyGridStyleDecls(custom['grid'] ? custom['grid'] : {}, defaultGridStyleDecls),
    tile: modifyTileStyleDecls(custom['tile'] ? custom['tile'] : {}, defaultTileStyleDecls),
  }
}

/* GRID STYLE SCHEMA TYPES */
export type GridStyleSchema = {
  grid: GridStyleDecls,
  tile: TileStyleDecls
}