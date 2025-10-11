import { mergeDeep, Extendable, Extensions, Position, deleteExtensions, getElementSelector } from './utils.js';
import { demangleProperties, demangleContentIds, mangleContentSnapshot, demangleContentLocationIds } from './mangle.js';
import { Registry, ContentIds, ContentIdsProperties, MapIdsProperties, TileIdsProperties } from './registry.js';
import { AbstractTile } from './tile.js';
import { calc } from './style/utils.js';

// Snapshot and extension types
export type ContentSnapshot = ContentProperties & Extendable;
export type ContentProperties = {
  ids: ContentIdsProperties,
  figure: string,
  location: ContentLocationIds,
  offset: Position
};

export type ContentArguments = Omit<ContentProperties, 'figure'|'ids'> & {
  ids: ContentIdsProperties|MapIdsProperties,
  figure: HTMLElement|string
};

export type ContentLocationIds = TileIdsProperties|ContentIdsProperties|undefined;
type ContentLocation = AbstractTile|Content|undefined;

type ContentElements = {
  position: HTMLElement,
  container: HTMLElement,
  figure: HTMLElement,
}

export class Content implements ContentProperties, Extendable {
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

  protected _extensions: Extensions = {};
  protected set extensions(value: Extensions) { this._extensions = value; }
  public get extensions() : Extensions { return this._extensions; }

  constructor(args: ContentArguments) {
    if (typeof (args.ids as ContentIdsProperties).content === 'number') {
      this.ids = new ContentIds(args.ids, (args.ids as ContentIdsProperties).content);
    } else {
      this.ids = new ContentIds(args.ids, Registry.id());
    }

    if (typeof args.figure === 'string') {
      this.figure = args.figure;
    } else {
      this.figure = getElementSelector(args.figure);
    }

    this.location = args.location;
    
    this.offset = args.offset;
  }

  public static import(snapshot: ContentSnapshot) : Content {
    let mangledSnapshot = mangleContentSnapshot(snapshot);
    let instance = new Content(mangledSnapshot);
    instance.extend(mangledSnapshot.extensions);
    return instance;
  }
  public extend(extensions: Extensions) : void {
    mergeDeep(this.extensions, extensions);
  }
  
  public shrink(extensions: string[]) : void {
    deleteExtensions(this.extensions, extensions);
  }

  public export() : ContentSnapshot {
    return this.exportExtensions(this.exportProperties()) as ContentSnapshot;
  }
  protected exportProperties(object: object = {}) : ContentProperties {
    demangleProperties(object, [
      ['ids', demangleContentIds(this.ids)],
      ['figure', this.elements && this.elements.figure ? this.elements.figure.outerHTML : this.figure],
      ['location', this.location ? demangleContentLocationIds(this.location) : undefined],
      ['offset', this.offset]
    ]);
    return object as ContentProperties;
  }
  protected exportExtensions(object: object = {}) : Extendable {
    demangleProperties(object, [
      ['extensions', this.extensions]
    ]);
    return object as Extendable;
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
    if (this.elements) {
      return;
    }

    let position = document.createElement('div');
    let container = document.createElement('div');
    position.appendChild(container);

    let figure;
    try {
      figure = document.querySelector(this.figure);
    } catch(error) {}

    if (!figure) {
      let figureWrapper = document.createElement('div');
      figureWrapper.innerHTML = this.figure;
      figure = figureWrapper.children[0] as HTMLElement;
    }

    figure.addEventListener('mouseover', () => this.hover(), false);
    figure.addEventListener('mouseout', () => this.unhover(), false);

    container.appendChild(figure);

    this.elements = {
      position,
      container,
      figure: figure as HTMLElement,
    }
  }

  public render() : void {
    this.initElements();

    if (this.host && this.host instanceof AbstractTile) {
      let tileZeroPosition = this.host.style.grid.tileZeroPosition;
      let locationPosition = this.host.style.grid.tileInnerPosition(this.host.cartesianCoords);
      let size = this.host.style.size.inner;
      this.elements.position.style.top = calc.add(tileZeroPosition.top, locationPosition.top, this.offset.top, calc.div(size.height, 2));
      this.elements.position.style.left = calc.add(tileZeroPosition.left, locationPosition.left, this.offset.top, calc.div(size.width, 2));
    }

    if (!this.map.elements.content.contains(this.elements.position)) {
      this.map.elements.content.appendChild(this.elements.position);
    }
  }
}