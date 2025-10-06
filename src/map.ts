import { AbstractGrid, GridArguments, GridSnapshot } from './grid.js';

import { GridMapStyleSchema } from './style/schema.js';
import { MapStyle, GridMapStyle } from './style/map.js';
import { ContentIds, GridIdsProperties, MapIds, MapIdsProperties, Registry } from './registry.js';
import { MapType, mergeDeep, Extendable, Extensions, signedTablefromObject, } from './utils.js';
import { demangleProperties, demangleMapIds, demangleGridMapStyleSchema, mangleContentParams } from './mangle.js';
import { Content, ContentSnapshot } from './content.js';
import { ElemapContent } from './index/content.js'
import { ContentParameters } from './index/map.js';
import { ElemapTile } from './index/tile.js';

interface MapElements {
  container?: HTMLElement,
  map: HTMLElement,
  content: HTMLElement
}

// Snapshot and extension types
export type MapSnapshot = {
  type: MapType,
} & MapProperties & Extendable;
type MapProperties = {
  ids: MapIdsProperties,
  contents: ContentSnapshot[]
};

export type MapArguments = Omit<MapProperties, 'ids'> & {
  ids: MapIdsProperties | undefined
};

export abstract class AbstractMap implements MapProperties, Extendable {
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

  protected _extensions: Extensions = {};
  protected set extensions(value: Extensions) { this._extensions = value; }
  public get extensions() : Extensions { return this._extensions; }

  protected _contents: Content[] = [];
  protected set contents(value: Content[]) { this._contents = value; }
  public get contents() : Content[] { return this._contents; }

  constructor(args: MapArguments) {
    if (args.ids && typeof args.ids.map === 'number') {
      this.ids = new MapIds(args.ids.map);
    } else {
      this.ids = new MapIds(Registry.id());
    }
    Registry.add(this);

    if (args.contents) {
      this.importContents(args.contents);
    }
  }

  // 'static' modifier cannot be used with 'abstract' modifier.
  // public static abstract import(snapshot: MapSnapshot) : AbstractMap;

  public abstract export() : MapSnapshot;
  protected exportSnapshot() : MapSnapshot {
    return  this.exportExtensions(this.exportProperties()) as MapSnapshot;
  }
  protected exportProperties(object: object = {}) : MapProperties {
    demangleProperties(object, [
      ['type', this.exportMapType()],
      ['ids', demangleMapIds(this.ids)],
      ['contents', this.contents.map(content => content.export())]
    ]);
    return object as MapProperties;
  }
  protected exportExtensions(object: object = {}) : Extendable {
    demangleProperties(object, [
      ['extensions', this.extensions]
    ]);
    return object as Extendable;
  }
  protected abstract exportMapType() : string;
  
  protected importContents(snapshot: ContentSnapshot[]) : void {
    for (let content of snapshot) {
      this.contents.push(Content.import(content));
    }
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
    this.style.render();
    for (let content of this.contents) {
      content.render();
    }
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
    let mangledParams = mangleContentParams(params);
    if (mangledParams.location instanceof ElemapTile) {
      // @ts-ignore
      mangledParams.location = (this as AbstractGridMap).grid.tileByCoords(mangledParams.location.coords)!.ids;
    } else {
      mangledParams.location = undefined;
    }

    let content = new Content(Object.assign(
      mangledParams,
      {
        ids: this.ids,
        offset: params.offset || {top:'0', right:'0'},
      }
    ));
    this.contents.push(content);
    return new ElemapContent(content);
  }
}

// Snapshot and extension types
export type GridMapSnapshot = {
  type: MapType,
} & GridMapProperties & GridMapExtensions;
export type GridMapExtension = Extensions;
type GridMapProperties = MapProperties & {
  grid: GridSnapshot,
  schema: GridMapStyleSchema
};
type GridMapExtensions = Extendable;

export type GridMapArguments = Omit<GridMapProperties, 'ids' | 'grid'> & {
  ids: MapIdsProperties | undefined,
  grid: Omit<GridArguments, 'ids'> & { ids: GridIdsProperties | undefined }
};

export abstract class AbstractGridMap<G extends AbstractGrid = AbstractGrid> extends AbstractMap implements GridMapProperties, GridMapExtensions {
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

    // Might want to configure the pipeline in a better way later
    if (args.grid.tiles) {
      this.grid.importTiles(signedTablefromObject(args.grid.tiles));
    }
  }

  protected static importSnapshot<M extends AbstractGridMap>(mapClass: new (args: GridMapArguments) => M, snapshot: GridMapSnapshot) : M {
    let instance = new mapClass(snapshot);
    instance.extend(snapshot.extensions);
    return instance;
  }
  public extend(extension: GridMapExtension) : void {
    mergeDeep(this.extensions, extension);
  }

  protected override exportProperties(object: object = {}) : GridMapProperties {
    demangleProperties(object, [
      ['type', this.exportMapType()],
      ['ids', demangleMapIds(this.ids)],
      ['grid', this.grid.export()],
      ['schema', demangleGridMapStyleSchema(this.schema)],
      ['contents', this.contents.map(content => content.export())]
    ]);
    return object as GridMapProperties;
  }
  protected override exportExtensions(object: object = {}) : GridMapExtensions {
    demangleProperties(object, [
      ['extensions', this.extensions]
    ]);
    return object as GridMapExtensions;
  }

  public override render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.grid.render(this.elements.map!);
    this.style.render();
    for (let content of this.contents) {
      content.render();
    }
  }
}