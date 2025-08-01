import { mergeDeep, Mutables, Mutation } from './utils.js';
import { demangleProperties, demangleContentIds, mangleContentSnapshot } from './mangle.js';
import { Register, ContentIds, ContentIdsProperties, MapIdsProperties } from './register.js';
import { AbstractTile } from './tile.js';

// Snapshot and mutation types
export type ContentSnapshot = ContentConstants & Mutables;
export type ContentConstants = {
  ids: ContentIdsProperties,
  figure: string
};

export type ContentArguments = Omit<ContentConstants, 'figure'|'ids'> & {
  ids: ContentIdsProperties|MapIdsProperties,
  figure: HTMLElement|string
};

type ContentLocation = AbstractTile|Content|undefined;

type ContentElements = {
  figure: HTMLElement,
  container?: HTMLElement
}

export class Content implements Omit<ContentConstants, 'figure'>, Mutables {
  protected _ids: ContentIds;
  protected set ids(value: ContentIds) { this._ids = value; }
  public get ids() : ContentIds { return this._ids; }

  public get map() { return Register.map.abstract(this.ids)!; }

  protected _location: ContentLocation = undefined;
  protected set location(value: ContentLocation) { this._location = value; }
  public get location() : ContentLocation { return this._location; }

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

    console.log(this.elements.figure);

    if (!this.elements.container!.contains(this.elements.figure)) {
      this.elements.container!.appendChild(this.elements.figure);
    }

    if (!this.map.elements.content.contains(this.elements.container!)) {
      this.map.elements.content.appendChild(this.elements.container!);
    }
  }
}