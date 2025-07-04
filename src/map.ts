import { AbstractGrid, GridArguments, GridSnapshot } from './grid.js';

import { GridMapStyleSchema } from './style/schema.js';
import { MapStyle, GridMapStyle } from './style/map.js';
import { GridIdsProperties, MapIds, MapIdsProperties, Register } from './register.js';
import { MapType, mergeDeep, Mutables, Mutation, } from './utils.js';
import { demangleProperties, demangleMapIds, demangleGridMapStyleSchema } from './mangle.js';

interface MapElements {
  container?: HTMLElement,
  map: HTMLElement,
}

// Snapshot and mutation types
export type MapSnapshot = {
  type: MapType,
} & MapConstants & Mutables;
type MapConstants = {
  ids: MapIdsProperties
};

export type MapArguments = Omit<MapConstants, 'ids'> & {
  ids: MapIdsProperties | undefined
};

export abstract class AbstractMap implements MapConstants, Mutables {
  protected _ids: MapIds;
  protected set ids(value: MapIds) { this._ids = value; }
  public get ids() : MapIds { return this._ids; }

  protected _elements: MapElements;
  protected set elements(value: MapElements) { this._elements = value; }
  public get elements() : MapElements { return this._elements; }

  protected _style: MapStyle;
  protected set style(value: MapStyle) { this._style = value; }
  public get style() : MapStyle { return this._style; }

  public get classes() {
    return {
      base: `elemap-${this.ids.map}`,
      container: `elemap-${this.ids.map}-container`,
      map: `elemap-${this.ids.map}-map`
    };
  }

  protected _data: Record<string, any> = {};
  protected set mutables(value: Record<string, any>) { this._data = value; }
  public get mutables() : Record<string, any> { return this._data; }

  constructor(args: MapArguments) {
    if (args.ids && typeof args.ids.map === 'number') {
      this.ids = new MapIds(args.ids.map);
    } else {
      this.ids = new MapIds(Register.id());
    }
    Register.add(this);
  }

  // @ts-ignore 'static' modifier cannot be used with 'abstract' modifier.
  public static abstract import(snapshot: MapSnapshot) : AbstractMap;

  public abstract export() : MapSnapshot;
  protected exportSnapshot() : MapSnapshot {
    return  this.exportMutables(this.exportConstants()) as MapSnapshot;
  }
  protected exportConstants(object: object = {}) : MapConstants {
    demangleProperties(object, [
      ['type', this.exportMapType()],
      ['ids', demangleMapIds(this.ids)]
    ]);
    return object as MapConstants;
  }
  protected exportMutables(object: object = {}) : Mutables {
    demangleProperties(object, [
      ['mutables', this.mutables]
    ]);
    return object as Mutables;
  }
  protected abstract exportMapType() : string;
  public report() : Mutation {
    return this.mutables;
  }

  protected abstract initStyle(schema: GridMapStyleSchema) : void;

  protected initElements() : MapElements {    
    let elementMap = document.createElement('div');
    elementMap.classList.add(`elemap-${this.ids.map}-map`);

    return {
      map: elementMap
    };
  }

  public initRender(container: HTMLElement) {
    for (let element of document.getElementsByClassName('elemap-' + this.ids.map + '-container')) {
      if (element === container) {
        continue;
      }
      element.classList.remove('elemap-' + this.ids.map + '-container');
    }
    if (this.elements.container !== container) {
      this.elements.container = container;
      this.elements.container.classList.add('elemap-' + this.ids.map + '-container');
    }

    this.elements.container.appendChild(this.elements.map);
  }

  public render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.style.render();
  }
}

// Snapshot and mutation types
export type GridMapSnapshot = {
  type: MapType,
} & GridMapConstants & GridMapMutables;
export type GridMapMutation = Mutation;
type GridMapConstants = MapConstants & {
  grid: GridSnapshot,
  schema: GridMapStyleSchema
};
type GridMapMutables = Mutables;

export type GridMapArguments = Omit<GridMapConstants, 'ids' | 'grid'> & {
  ids: MapIdsProperties | undefined,
  grid: Omit<GridArguments, 'ids'> & { ids: GridIdsProperties | undefined }
};

export abstract class AbstractGridMap<G extends AbstractGrid = AbstractGrid> extends AbstractMap implements GridMapConstants, GridMapMutables {
  public readonly grid: G;

  protected override _style: GridMapStyle;
  protected override set style(value: GridMapStyle) { this._style = value; }
  public override get style() : GridMapStyle { return this._style; }

  public get schema() : GridMapStyleSchema {
    return {
      map: this.style.decls,
      grid: this.style.grid.decls,
      tile: this.style.grid.tile.decls
    }
  }

  constructor(args: GridMapArguments, gridClass: new (args: GridArguments) => G) {
    super(args);
    // If grid has ids specified, then it's importing
    if (args.grid.ids && typeof args.grid.ids.grid === 'number') {
      // @ts-ignore
      this.grid = gridClass.import(args.grid);
    } else {
      this.grid = new gridClass(Object.assign(args.grid, {ids: this.ids}));
    }
    this.initStyle(args.schema);
  }

  protected static importSnapshot<M extends AbstractGridMap>(mapClass: new (args: GridMapArguments) => M, snapshot: GridMapSnapshot) : M {
    let instance = new mapClass(snapshot);
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: GridMapMutation) : void {
    mergeDeep(this.mutables, mutation);
  }

  protected override exportConstants(object: object = {}) : GridMapConstants {
    demangleProperties(object, [
      ['type', this.exportMapType()],
      ['ids', demangleMapIds(this.ids)],
      ['grid', this.grid.export()],
      ['schema', demangleGridMapStyleSchema(this.schema)]
    ]);
    return object as GridMapConstants;
  }
  protected override exportMutables(object: object = {}) : GridMapMutables {
    demangleProperties(object, [
      ['mutables', this.mutables]
    ]);
    return object as GridMapMutables;
  }

  public override render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.grid.render(this.elements.map!);
    this.style.render();
  }
}