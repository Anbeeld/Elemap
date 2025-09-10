import { AbstractGrid, GridArguments, GridSnapshot } from './grid.js';

import { GridMapStyleSchema } from './style/schema.js';
import { MapStyle, GridMapStyle } from './style/map.js';
import { ContentIds, GridIdsProperties, MapIds, MapIdsProperties, Register } from './register.js';
import { MapType, mergeDeep, Mutations, Mutation, } from './utils.js';
import { demangleProperties, demangleMapIds, demangleGridMapStyleSchema, mangleContentParams } from './mangle.js';
import { Content } from './content.js';
import { ElemapContent } from './index/content.js'
import { ContentParameters } from './index/index.js';

interface MapElements {
  container?: HTMLElement,
  map: HTMLElement,
  content: HTMLElement
}

// Snapshot and mutation types
export type MapSnapshot = {
  type: MapType,
} & MapConstants & Mutations;
type MapConstants = {
  ids: MapIdsProperties
};

export type MapArguments = Omit<MapConstants, 'ids'> & {
  ids: MapIdsProperties | undefined
};

export abstract class AbstractMap implements MapConstants, Mutations {
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

  protected _mutations: Record<string, any> = {};
  protected set mutations(value: Record<string, any>) { this._mutations = value; }
  public get mutations() : Record<string, any> { return this._mutations; }

  protected _contents: Content[] = [];
  protected set contents(value: Content[]) { this._contents = value; }
  public get contents() : Content[] { return this._contents; }

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
    return  this.exportMutations(this.exportConstants()) as MapSnapshot;
  }
  protected exportConstants(object: object = {}) : MapConstants {
    demangleProperties(object, [
      ['type', this.exportMapType()],
      ['ids', demangleMapIds(this.ids)]
    ]);
    return object as MapConstants;
  }
  protected exportMutations(object: object = {}) : Mutations {
    demangleProperties(object, [
      ['mutations', this.mutations]
    ]);
    return object as Mutations;
  }
  protected abstract exportMapType() : string;
  public report() : Mutation {
    return this.mutations;
  }

  protected abstract initStyle(schema: GridMapStyleSchema) : void;

  protected initElements() : MapElements {
    if (this.elements && this.elements.map) {
      return this.elements;
    } else {
      let elementMap = document.createElement('div');
      elementMap.classList.add(`elemap-${this.ids.map}-map`);

      let elementContent = document.createElement('div');
      elementContent.classList.add(`elemap-${this.ids.map}-content`);

      return {
        map: elementMap,
        content: elementContent
      };
    }
  }

  public initRender(container?: HTMLElement) {
    if (container && this.elements.container !== container) {
      this.elements.container = container;
      this.elements.container.innerHTML = '';
      this.elements.container.classList.add('elemap-' + this.ids.map + '-container');
    }

    if (!this.elements.container) {
      throw new Error('No container found.');
    }

    for (let element of document.getElementsByClassName('elemap-' + this.ids.map + '-container')) {
      if (element === this.elements.container) {
        continue;
      }
      element.classList.remove('elemap-' + this.ids.map + '-container');
    }

    this.elements.container.appendChild(this.elements.map);

    this.elements.container.appendChild(this.elements.content);
  }

  public render(container?: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    for (let content of this.contents) {
      content.render();
    }
    this.style.render();
  }

  public contentById(ids: ContentIds) : Content|undefined {
    for (let content of this.contents) {
      if (content.ids.content === ids.content) {
        return content;
      }
    }
    return undefined;
  }

  public contentByElement(element: HTMLElement) : Content|undefined {
    for (let content of this.contents) {
      if (content.elements.figure === element) {
        return content;
      }
    }
    return undefined;
  }

  public addContent(params: ContentParameters) : ElemapContent {
    let content = new Content(Object.assign(
      mangleContentParams(params),
      {
        ids: this.ids,
        offset: params.offset || {top:'0', right:'0'},
      }
    ));
    this.contents.push(content);
    return new ElemapContent(content);
  }
}

// Snapshot and mutation types
export type GridMapSnapshot = {
  type: MapType,
} & GridMapConstants & GridMapMutations;
export type GridMapMutation = Mutation;
type GridMapConstants = MapConstants & {
  grid: GridSnapshot,
  schema: GridMapStyleSchema
};
type GridMapMutations = Mutations;

export type GridMapArguments = Omit<GridMapConstants, 'ids' | 'grid'> & {
  ids: MapIdsProperties | undefined,
  grid: Omit<GridArguments, 'ids'> & { ids: GridIdsProperties | undefined }
};

export abstract class AbstractGridMap<G extends AbstractGrid = AbstractGrid> extends AbstractMap implements GridMapConstants, GridMapMutations {
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
    mergeDeep(this.mutations, mutation);
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
  protected override exportMutations(object: object = {}) : GridMapMutations {
    demangleProperties(object, [
      ['mutations', this.mutations]
    ]);
    return object as GridMapMutations;
  }

  public override render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.grid.render(this.elements.map!);
    for (let content of this.contents) {
      content.render();
    }
    this.style.render();
  }
}