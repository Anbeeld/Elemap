// import { GridSnapshot } from './grid.js';
// import { GridMapSnapshot } from './map.js';
import { ContentLocationIds, ContentSnapshot } from './content.js';
import { ContentParameters } from './index/map.js';
import { ContentIds, ContentIdsProperties, GridIds, GridIdsProperties, MapIds, MapIdsProperties, TileIds, TileIdsProperties } from './registry.js';
import { GridMapStyleSchema, GridStyleDecls, GridStyleSchema, MapStyleDecls, TileStyleDecls } from './style/schema.js';
import { TileSnapshot } from './tile.js';
import { AxialCoords, Coords, CartesianCoords } from './utils.js';

export function mangleProperty(object: any, name: string) : any {
  if (!object || !object.hasOwnProperty(name)) {
    return undefined;
  }
  return object[name];
}

export function demangleProperty(object: any, name: string, value: any) : any {
  if (!object) {
    return;
  }
  object[name] = value;
  return object;
}

export function demangleProperties(object: any, properties: [string, any][]) : any {
  for (let property of properties) {
    demangleProperty(object, property[0], property[1]);
  }
  return object;
}


export function demangleMapIds(ids: MapIds) : MapIdsProperties {
  let object = {};
  demangleProperty(object, 'map', ids.map);
  // @ts-ignore
  return object;
}
export function mangleMapIds(object: any) : MapIds {
  return {
    map: mangleProperty(object, 'map')
  };
}

export function demangleGridIds(ids: GridIds) : GridIdsProperties {
  let object = {};
  demangleProperty(object, 'map', ids.map);
  demangleProperty(object, 'grid', ids.grid);
  // @ts-ignore
  return object;
}
export function mangleGridIds(object: any) : GridIds {
  return {
    map: mangleProperty(object, 'map'),
    grid: mangleProperty(object, 'grid')
  };
}

export function demangleTileIds(ids: TileIds) : TileIdsProperties {
  let object = {};
  demangleProperty(object, 'map', ids.map);
  demangleProperty(object, 'grid', ids.grid);
  demangleProperty(object, 'tile', ids.tile);
  // @ts-ignore
  return object;
}
export function mangleTileIds(object: any) : TileIds {
  return {
    map: mangleProperty(object, 'map'),
    grid: mangleProperty(object, 'grid'),
    tile: mangleProperty(object, 'tile')
  };
}

export function demangleContentIds(ids: ContentIds) : ContentIdsProperties {
  let object = {};
  demangleProperty(object, 'map', ids.map);
  demangleProperty(object, 'content', ids.content);
  // @ts-ignore
  return object;
}
export function mangleContentIds(object: any) : ContentIds {
  return {
    map: mangleProperty(object, 'map'),
    content: mangleProperty(object, 'content')
  };
}

export function demangleContentLocationIds(ids: ContentLocationIds) : ContentLocationIds {
  let object = {};
  if (ids) {
    if ((ids as ContentIdsProperties).content) {
      object = demangleContentIds(ids as ContentIdsProperties);
    } else if ((ids as TileIdsProperties).tile) {
      object = demangleTileIds(ids as TileIdsProperties);
    }
  }
  // @ts-ignore
  return object;
}
export function mangleContentLocationIds(object: any) : ContentLocationIds {
  if (!object) {
    return undefined;
  } else if (mangleProperty(object, 'content')) {
    return mangleContentIds(object);
  } else if (mangleProperty(object, 'tile')) {
    return mangleTileIds(object);
  } else {
    return undefined;
  }
}

export function demangleAxialCoords(axial: AxialCoords) : AxialCoords {
  let object = {};
  demangleProperty(object, 'q', axial.q);
  demangleProperty(object, 'r', axial.r);
  // @ts-ignore
  return object;
}
export function mangleAxialCoords(object: any) : AxialCoords {
  return {
    q: mangleProperty(object, 'q'),
    r: mangleProperty(object, 'r')
  };
}

export function demangleCartesianCoords(cartesian: CartesianCoords) : CartesianCoords {
  let object = {};
  demangleProperty(object, 'x', cartesian.x);
  demangleProperty(object, 'y', cartesian.y);
  // @ts-ignore
  return object;
}
export function mangleCartesianCoords(object: any) : CartesianCoords {
  return {
    x: mangleProperty(object, 'x'),
    y: mangleProperty(object, 'y')
  };
}

export function demangleMapStyleDecls(decls: MapStyleDecls) : MapStyleDecls {
  return demangleProperties({}, [
    ['outer', decls.outer],
    ['inner', decls.inner],
  ]);
}
export function mangleMapStyleDecls(object: any) : MapStyleDecls {
  return {
    outer: mangleProperty(object, 'outer'),
    inner: mangleProperty(object, 'inner'),
  };
}

export function demangleGridStyleDecls(decls: GridStyleDecls) : GridStyleDecls {
  return demangleProperties({}, [
    ['frame', decls.frame],
    ['contour', decls.contour],
  ]);
}
export function mangleGridStyleDecls(object: any) : GridStyleDecls {
  return {
    frame: mangleProperty(object, 'frame'),
    contour: mangleProperty(object, 'contour'),
  };
}

export function demangleTileStyleDecls(decls: TileStyleDecls) : TileStyleDecls {
  return demangleProperties({}, [
    ['outer', decls.outer],
    ['inner', decls.inner],
    ['hover', demangleProperties({}, [
      ['outer', decls.hover.outer],
      ['inner', decls.hover.inner]
    ])],
  ]);
}
export function mangleTileStyleDecls(object: any) : TileStyleDecls {
  return {
    outer: mangleProperty(object, 'outer'),
    inner: mangleProperty(object, 'inner'),
    hover: {
      outer: mangleProperty(mangleProperty(object, 'hover'), 'outer'),
      inner: mangleProperty(mangleProperty(object, 'hover'), 'inner'),
    }
  };
}

export function demangleGridStyleSchema(gridStyleSchema: GridStyleSchema) : GridStyleSchema {
  return demangleProperties({}, [
    ['grid', demangleGridStyleDecls(gridStyleSchema.grid)],
    ['tile', demangleTileStyleDecls(gridStyleSchema.tile)],
  ]);
}
export function mangleGridStyleSchema(object: any) : GridStyleSchema {
  return {
    grid: mangleGridStyleDecls(mangleProperty(object, 'grid')),
    tile: mangleTileStyleDecls(mangleProperty(object, 'tile')),
  };
}

export function demangleGridMapStyleSchema(gridMapStyleSchema: GridMapStyleSchema) : GridMapStyleSchema {
  return demangleProperties({}, [
    ['map', demangleMapStyleDecls(gridMapStyleSchema.map)],
    ['grid', demangleGridStyleDecls(gridMapStyleSchema.grid)],
    ['tile', demangleTileStyleDecls(gridMapStyleSchema.tile)],
  ]);
}
export function mangleGridMapStyleSchema(object: any) : GridMapStyleSchema {
  return {
    map: mangleMapStyleDecls(mangleProperty(object, 'map')),
    grid: mangleGridStyleDecls(mangleProperty(object, 'grid')),
    tile: mangleTileStyleDecls(mangleProperty(object, 'tile')),
  };
}

export function mangleTileSnapshot<C extends Coords>(snapshot: any) : TileSnapshot<C> {
  return {
    ids: mangleTileIds(mangleProperty(snapshot, 'ids')),
    coords: mangleCoords<C>(mangleProperty(snapshot, 'coords')),
    decls: mangleProperty(snapshot, 'decls') ? mangleTileStyleDecls(mangleProperty(snapshot, 'decls')) : false,
    mutations: mangleProperty(snapshot, 'mutations')
  };
}

export function mangleContentSnapshot(snapshot: any) : ContentSnapshot {
  return {
    ids: mangleContentIds(mangleProperty(snapshot, 'ids')),
    figure: mangleProperty(snapshot, 'figure'),
    location: mangleContentLocationIds(mangleProperty(snapshot, 'location')),
    offset: mangleProperty(snapshot, 'offset'),
    mutations: mangleProperty(snapshot, 'mutations')
  };
}

export function mangleContentParams(params: any) : ContentParameters {
  return {
    figure: mangleProperty(params, 'figure'),
    location: mangleProperty(params, 'location'),
    offset: mangleProperty(params, 'offset'),
  };
}

export function mangleCoords<C extends Coords>(coords: C) : C {
  if (mangleProperty(coords, 'q') !== undefined && mangleProperty(coords, 'r') !== undefined) {
    return mangleAxialCoords(coords) as unknown as C;
  }
  return mangleCartesianCoords(coords) as unknown as C;
}
export function demangleCoords<C extends Coords>(coords: C) : C {
  if (coords.q !== undefined && coords.r !== undefined) {
    return demangleAxialCoords(coords as unknown as AxialCoords) as unknown as C;
  }
  return demangleCartesianCoords(coords as unknown as CartesianCoords) as unknown as C;
}