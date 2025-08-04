import { mergeDeep, Mutables, Mutation } from './utils.js';
import { demangleProperties, demangleContentIds, mangleContentSnapshot } from './mangle.js';
import { Register, ContentIds, ContentIdsProperties, MapIdsProperties, TileIdsProperties, TileIds } from './register.js';
import { AbstractTile } from './tile.js';
import { ElemapTile } from './index/tile.js';
import { AbstractGridMap } from './map.js';
import { calc } from './style/utils.js';

// Snapshot and mutation types
export type ContentSnapshot = ContentConstants & Mutables;
export type ContentConstants = {
  ids: ContentIdsProperties,
  figure: string,
  location: TileIdsProperties|ContentIdsProperties|undefined
};

export type ContentArguments = Omit<ContentConstants, 'figure'|'ids'> & {
  ids: ContentIdsProperties|MapIdsProperties,
  figure: HTMLElement|string
};

type ContentLocationIds = TileIds|ContentIds|undefined;
type ContentLocation = AbstractTile|Content|undefined;

type ContentElements = {
  figure: HTMLElement,
  container?: HTMLElement
}

export class Content implements Omit<ContentConstants, 'figure'|'location'>, Mutables {
  protected _ids: ContentIds;
  protected set ids(value: ContentIds) { this._ids = value; }
  public get ids() : ContentIds { return this._ids; }

  public get map() { return Register.map.abstract(this.ids)!; }

  protected _location: ContentLocationIds = undefined;
  protected set location(value: ContentLocationIds) { this._location = value; }
  public get location() : ContentLocation {
    if (this._location instanceof ContentIds) {
      return Register.content(this._location)!;
    } else if (this._location instanceof TileIds) {
      return Register.tile.abstract(this._location)!;
    }
    return undefined;
  }

  protected _elements: ContentElements;
  protected set elements(value: ContentElements) { this._elements = value; }
  public get elements() : ContentElements { return this._elements; }

  protected _mutables: Record<string, any> = {};
  protected set mutables(value: Record<string, any>) { this._mutables = value; }
  public get mutables() : Record<string, any> { return this._mutables; }

  constructor(args: ContentArguments) {
    if (typeof (args.ids as ContentIdsProperties).content === 'number') {
      this.ids = new ContentIds(args.ids, (args.ids as ContentIdsProperties).content);
    } else {
      this.ids = new ContentIds(args.ids, Register.id());
    }

    if (typeof args.figure === 'string') {
      let figureWrapper = document.createElement('div');
      figureWrapper.innerHTML = args.figure;
      this.elements = {figure: figureWrapper.children[0] as HTMLElement};
    } else {
      this.elements = {figure: args.figure};
    }

    if (args.location instanceof ElemapTile) {
      this.location = (this.map as AbstractGridMap).grid.tileByCoords(args.location.coords.x, args.location.coords.y)!.ids;
    }
    
  }

  // @ts-ignore 'static' modifier cannot be used with 'abstract' modifier.
  public static abstract import(snapshot: ContentSnapshot) : Content;
  protected static importSnapshot<T extends Content>(Content: new (args: ContentArguments) => T, snapshot: ContentSnapshot) : T {
    let instance = new Content(mangleContentSnapshot(snapshot));
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: Mutation) : void {
    mergeDeep(this.mutables, mutation);
  }

  public export() : ContentSnapshot {
    return this.exportMutables(this.exportConstants()) as ContentSnapshot;
  }
  protected exportConstants(object: object = {}) : ContentConstants {
    demangleProperties(object, [
      ['ids', demangleContentIds(this.ids)],
      ['figure', this.elements.figure.outerHTML],
      ['location', this.location ? this.location : undefined],
      ['mutables', this.mutables]
    ]);
    return object as ContentConstants;
  }
  protected exportMutables(object: object = {}) : Mutables {
    demangleProperties(object, [
      ['mutables', this.mutables]
    ]);
    return object as Mutables;
  }
  public report() : Mutation {
    return this.mutables;
  }

  public hover() : void {
    if (this.location && typeof this.location.hover === 'function') {
      this.location.hover();
    }
  }
  public unhover() : void {
    if (this.location && typeof this.location.unhover === 'function') {
      this.location.unhover();
    }
  }
  
  protected initElements() : void {
    if (!this.elements.container) {
      this.elements.container = document.createElement('div')
    }
  }

  public render() : void {
    this.initElements();

    if (this.location && this.location instanceof AbstractTile) {
      let tileZeroPosition = this.location.style.grid.tileZeroPosition;
      let locationPosition = this.location.style.innerPosition;
      let size = this.location.style.size.inner;
      this.elements.container!.style.top = calc.add(tileZeroPosition.top, locationPosition.top, calc.div(size.height, 2));
      this.elements.container!.style.left = calc.add(tileZeroPosition.left, locationPosition.left, calc.div(size.width, 2));
    }

    if (!this.elements.container!.contains(this.elements.figure)) {
      this.elements.container!.appendChild(this.elements.figure);
    }

    if (!this.map.elements.content.contains(this.elements.container!)) {
      this.map.elements.content.appendChild(this.elements.container!);
    }
  }
}