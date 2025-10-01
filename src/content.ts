import { mergeDeep, Mutations, Mutation, Position } from './utils.js';
import { demangleProperties, demangleContentIds, mangleContentSnapshot, demangleContentLocationIds } from './mangle.js';
import { Registry, ContentIds, ContentIdsProperties, MapIdsProperties, TileIdsProperties } from './registry.js';
import { AbstractTile } from './tile.js';
import { calc } from './style/utils.js';

// Snapshot and mutation types
export type ContentSnapshot = ContentConstants & Mutations;
export type ContentConstants = {
  ids: ContentIdsProperties,
  figure: string,
  location: ContentLocationIds,
  offset: Position
};

export type ContentArguments = Omit<ContentConstants, 'figure'|'ids'> & {
  ids: ContentIdsProperties|MapIdsProperties,
  figure: HTMLElement|string
};

export type ContentLocationIds = TileIdsProperties|ContentIdsProperties|undefined;
type ContentLocation = AbstractTile|Content|undefined;

type ContentElements = {
  figure: HTMLElement,
  container?: HTMLElement
}

export class Content implements ContentConstants, Mutations {
  protected _ids: ContentIds;
  protected set ids(value: ContentIds) { this._ids = value; }
  public get ids() : ContentIds { return this._ids; }

  public get map() { return Registry.map.abstract(this.ids)!; }

  protected _figure: string;
  protected set figure(value: string) { this._figure = value; }
  public get figure() : string { return this._figure; }

  protected _location: ContentLocationIds = undefined;
  protected set location(value: ContentLocationIds) { this._location = value; }
  public get location() : ContentLocationIds { return this._location; }

  public get host() : ContentLocation {
    if ((this._location as ContentIdsProperties).content) {
      return Registry.content(this._location as ContentIdsProperties)!;
    } else if ((this._location as TileIdsProperties).tile) {
      return Registry.tile.abstract(this._location as TileIdsProperties)!;
    }
    return undefined;
  }

  protected _offset: Position;
  protected set offset(value: Position) { this._offset = value; }
  public get offset() : Position { return this._offset; }

  protected _elements: ContentElements;
  protected set elements(value: ContentElements) { this._elements = value; }
  public get elements() : ContentElements { return this._elements; }

  protected _mutations: Record<string, any> = {};
  protected set mutations(value: Record<string, any>) { this._mutations = value; }
  public get mutations() : Record<string, any> { return this._mutations; }

  constructor(args: ContentArguments) {
    if (typeof (args.ids as ContentIdsProperties).content === 'number') {
      this.ids = new ContentIds(args.ids, (args.ids as ContentIdsProperties).content);
    } else {
      this.ids = new ContentIds(args.ids, Registry.id());
    }

    if (typeof args.figure === 'string') {
      let figureWrapper = document.createElement('div');
      figureWrapper.innerHTML = args.figure;
      this.elements = {figure: figureWrapper.children[0] as HTMLElement};
    } else {
      this.elements = {figure: args.figure};
    }

    this.location = args.location;
    
    this.offset = args.offset;
  }

  public static import(snapshot: ContentSnapshot) : Content {
    let instance = new Content(mangleContentSnapshot(snapshot));
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: Mutation) : void {
    mergeDeep(this.mutations, mutation);
  }

  public export() : ContentSnapshot {
    return this.exportMutations(this.exportConstants()) as ContentSnapshot;
  }
  protected exportConstants(object: object = {}) : ContentConstants {
    demangleProperties(object, [
      ['ids', demangleContentIds(this.ids)],
      ['figure', this.elements.figure.outerHTML],
      ['location', this.location ? demangleContentLocationIds(this.location) : undefined],
      ['offset', this.offset]
    ]);
    return object as ContentConstants;
  }
  protected exportMutations(object: object = {}) : Mutations {
    demangleProperties(object, [
      ['mutations', this.mutations]
    ]);
    return object as Mutations;
  }
  public report() : Mutation {
    return this.mutations;
  }

  public hover() : void {
    if (this.host && typeof this.host.hover === 'function') {
      this.host.hover();
    }
  }
  public unhover() : void {
    if (this.host && typeof this.host.unhover === 'function') {
      this.host.unhover();
    }
  }
  
  protected initElements() : void {
    if (!this.elements.container) {
      this.elements.container = document.createElement('div')
    }
  }

  public render() : void {
    this.initElements();

    if (this.host && this.host instanceof AbstractTile) {
      let tileZeroPosition = this.host.style.grid.tileZeroPosition;
      let locationPosition = this.host.style.grid.tileInnerPosition(this.host.cartesianCoords);
      let size = this.host.style.size.inner;
      this.elements.container!.style.top = calc.add(tileZeroPosition.top, locationPosition.top, this.offset.top, calc.div(size.height, 2));
      this.elements.container!.style.left = calc.add(tileZeroPosition.left, locationPosition.left, this.offset.top, calc.div(size.width, 2));
    }

    if (!this.elements.container!.contains(this.elements.figure)) {
      this.elements.container!.appendChild(this.elements.figure);
    }

    if (!this.map.elements.content.contains(this.elements.container!)) {
      this.map.elements.content.appendChild(this.elements.container!);
    }
  }
}