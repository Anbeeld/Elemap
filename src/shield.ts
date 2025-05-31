import { GridSnapshot } from './grid.js';
import { GridMapSnapshot } from './map.js';
import { GridIds, GridIdsProperties, MapIds, MapIdsProperties, TileIds, TileIdsProperties } from './register.js';
import { GridMapStyleSchema, GridStyleDecls, GridStyleSchema, MapStyleDecls, TileStyleDecls } from './style/schema.js';
import { AxialCoords, Index, OrthogonalCoords, Size } from './utils.js';

export function unshieldProperty(object: any, name: string) : any {
  if (!object || !object.hasOwnProperty(name)) {
    return undefined;
  }
  return object[name];
}

export function shieldProperty(object: any, name: string, value: any) : any {
  if (!object) {
    return;
  }
  object[name] = value;
  return object;
}

export function shieldProperties(object: any, properties: [string, any][]) : any {
  for (let property of properties) {
    shieldProperty(object, property[0], property[1]);
  }
  return object;
}


export function shieldMapIds(ids: MapIds) : MapIdsProperties {
  let object = {};
  shieldProperty(object, 'map', ids.map);
  // @ts-ignore
  return object;
}
export function unshieldMapIds(object: any) : MapIds {
  return {
    map: unshieldProperty(object, 'map')
  };
}

export function shieldGridIds(ids: GridIds) : GridIdsProperties {
  let object = {};
  shieldProperty(object, 'map', ids.map);
  shieldProperty(object, 'grid', ids.grid);
  // @ts-ignore
  return object;
}
export function unshieldGridIds(object: any) : GridIds {
  return {
    map: unshieldProperty(object, 'map'),
    grid: unshieldProperty(object, 'grid')
  };
}

export function shieldTileIds(ids: TileIds) : TileIdsProperties {
  let object = {};
  shieldProperty(object, 'map', ids.map);
  shieldProperty(object, 'grid', ids.grid);
  shieldProperty(object, 'tile', ids.tile);
  // @ts-ignore
  return object;
}
export function unshieldTileIds(object: any) : TileIds {
  return {
    map: unshieldProperty(object, 'map'),
    grid: unshieldProperty(object, 'grid'),
    tile: unshieldProperty(object, 'tile')
  };
}

export function shieldSize(size: Size) : Size {
  let object = {};
  shieldProperty(object, 'width', size.width);
  shieldProperty(object, 'height', size.height);
  // @ts-ignore
  return object;
}
export function unshieldSize(object: any) : Size {
  return {
    width: unshieldProperty(object, 'width'),
    height: unshieldProperty(object, 'height')
  };
}

export function shieldIndex(index: Index) : Index {
  let object = {};
  shieldProperty(object, 'i', index.i);
  shieldProperty(object, 'j', index.j);
  // @ts-ignore
  return object;
}
export function unshieldIndex(object: any) : Index {
  return {
    i: unshieldProperty(object, 'i'),
    j: unshieldProperty(object, 'j')
  };
}

export function shieldAxialCoords(axial: AxialCoords) : AxialCoords {
  let object = {};
  shieldProperty(object, 'q', axial.q);
  shieldProperty(object, 'r', axial.r);
  // @ts-ignore
  return object;
}
export function unshieldAxialCoords(object: any) : AxialCoords {
  return {
    q: unshieldProperty(object, 'q'),
    r: unshieldProperty(object, 'r')
  };
}

export function shieldOrthogonalCoords(orthogonal: OrthogonalCoords) : OrthogonalCoords {
  let object = {};
  shieldProperty(object, 'x', orthogonal.x);
  shieldProperty(object, 'y', orthogonal.y);
  // @ts-ignore
  return object;
}
export function unshieldOrthogonalCoords(object: any) : OrthogonalCoords {
  return {
    x: unshieldProperty(object, 'x'),
    y: unshieldProperty(object, 'y')
  };
}

export function shieldMapStyleDecls(decls: MapStyleDecls) : MapStyleDecls {
  return shieldProperties({}, [
    ['outer', decls.outer],
    ['inner', decls.inner],
  ]);
}
export function unshieldMapStyleDecls(object: any) : MapStyleDecls {
  return {
    outer: unshieldProperty(object, 'outer'),
    inner: unshieldProperty(object, 'inner'),
  };
}

export function shieldGridStyleDecls(decls: GridStyleDecls) : GridStyleDecls {
  return shieldProperties({}, [
    ['frame', decls.frame],
    ['contour', decls.contour],
  ]);
}
export function unshieldGridStyleDecls(object: any) : GridStyleDecls {
  return {
    frame: unshieldProperty(object, 'frame'),
    contour: unshieldProperty(object, 'contour'),
  };
}

export function shieldTileStyleDecls(decls: TileStyleDecls) : TileStyleDecls {
  return shieldProperties({}, [
    ['outer', decls.outer],
    ['inner', decls.inner],
    ['hover', shieldProperties({}, [
      ['outer', decls.hover.outer],
      ['inner', decls.hover.inner]
    ])],
  ]);
}
export function unshieldTileStyleDecls(object: any) : TileStyleDecls {
  return {
    outer: unshieldProperty(object, 'outer'),
    inner: unshieldProperty(object, 'inner'),
    hover: {
      outer: unshieldProperty(unshieldProperty(object, 'hover'), 'outer'),
      inner: unshieldProperty(unshieldProperty(object, 'hover'), 'inner'),
    }
  };
}

export function shieldGridStyleSchema(gridStyleSchema: GridStyleSchema) : GridStyleSchema {
  return shieldProperties({}, [
    ['grid', shieldGridStyleDecls(gridStyleSchema.grid)],
    ['tile', shieldTileStyleDecls(gridStyleSchema.tile)],
  ]);
}
export function unshieldGridStyleSchema(object: any) : GridStyleSchema {
  return {
    grid: unshieldGridStyleDecls(unshieldProperty(object, 'grid')),
    tile: unshieldTileStyleDecls(unshieldProperty(object, 'tile')),
  };
}

export function shieldGridMapStyleSchema(gridMapStyleSchema: GridMapStyleSchema) : GridMapStyleSchema {
  return shieldProperties({}, [
    ['map', shieldMapStyleDecls(gridMapStyleSchema.map)],
    ['grid', shieldGridStyleDecls(gridMapStyleSchema.grid)],
    ['tile', shieldTileStyleDecls(gridMapStyleSchema.tile)],
  ]);
}
export function unshieldGridMapStyleSchema(object: any) : GridMapStyleSchema {
  return {
    map: unshieldMapStyleDecls(unshieldProperty(object, 'map')),
    grid: unshieldGridStyleDecls(unshieldProperty(object, 'grid')),
    tile: unshieldTileStyleDecls(unshieldProperty(object, 'tile')),
  };
}

export function unshieldGridMapSnapshot(object: any) : GridMapSnapshot {
  return {
    type: unshieldProperty(object, 'type'),
    ids: unshieldMapIds(unshieldProperty(object, 'ids')),
    grid: unshieldProperty(object, 'grid'),
    schema: unshieldGridMapStyleSchema(unshieldProperty(object, 'schema')),
  }
}

export function unshieldGridSnapshot(snapshot: any) : GridSnapshot {
  return {
    ids: unshieldGridIds(unshieldProperty(snapshot, 'ids')),
    size: unshieldSize(unshieldProperty(snapshot, 'size')),
    orientation: unshieldProperty(snapshot, 'orientation'),
    offset: unshieldProperty(snapshot, 'offset'),
    tiles: unshieldProperty(snapshot, 'tiles'),
    schema: unshieldGridStyleSchema(unshieldProperty(snapshot, 'schema'))
  };
}