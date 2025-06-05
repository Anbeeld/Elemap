import { AbstractTile, TileSnapshot } from "./tile.js";
import { Size, GridOrientation, GridOffset, OrthogonalCoords, mergeDeep } from "./utils.js";
import { GridIds, GridIdsProperties, MapIdsProperties, Register, TileIds } from "./register.js";
import { GridStyleSchema } from "./style/schema.js";
import { demangleProperties, demangleSize, demangleGridIds, demangleGridStyleSchema, mangleProperty } from "./mangle.js";

// Snapshot and mutation types
export type GridSnapshot = GridConstants & GridMutables;
type GridMutation = Partial<GridMutables>;
type GridConstants = {
  ids: GridIdsProperties,
  size: Size,
  orientation: GridOrientation,
  offset: GridOffset,
  schema: GridStyleSchema | false, // false = use map default grid and tile style
  tiles: TileSnapshot[][]
};
type GridMutables = {
  data: Record<string, any>
};

export type GridArguments = Omit<GridConstants, 'ids'> & {
  ids: MapIdsProperties | GridIdsProperties
};

interface GridElements {
  frame: HTMLElement;
  outer: HTMLElement;
  inner: HTMLElement;
  outerRows: HTMLElement[];
  innerRows: HTMLElement[];
  contour: HTMLElement;
  contourHover: HTMLElement;
}

export abstract class AbstractGrid<T extends AbstractTile = AbstractTile> implements GridConstants, GridMutables {
  protected _ids: GridIds;
  protected set ids(value: GridIds) { this._ids = value; }
  public get ids() : GridIds { return this._ids; }

  protected _size: Size;
  protected set size(value: Size) { this._size = value; }
  public get size() : Size { return this._size; }

  public tiles: T[][] = [];

  public tile(firstCoord: number, secondCoord: number) {
    return this.tileByCoords(firstCoord, secondCoord);
  }
  public abstract tileByCoords(firstCoord: number, secondCoord: number) : T|undefined;
  public abstract tileByElement(element: HTMLElement) : T|undefined;
  public tileByIndex(i: number, j: number) : T|undefined {
    return this.tiles[i]?.[j];
  }
  public tileById(ids: TileIds) : T|undefined {
    for (let i in this.tiles) {
      for (let j in this.tiles[i]) {
        if (this.tiles[i]![j as any]!.ids.tile === ids.tile) {
          return this.tiles[i]![j as any]!;
        }
      }
    }
    return undefined;
  }

  public get style() { return Register.map.grid(this.ids)!.style.grid; }
  public get schema() : GridStyleSchema { return {grid: this.style.decls, tile: this.style.tile.decls}; }

  public get classes() {
    let base = `elemap-${this.ids.map}`;
    return {
      base: base,
      frame: base + `-frame`,
      grid: base + `-grid`,
      outerGrid: base + `-outer`,
      innerGrid: base + `-inner`,
      contour: base + `-contour`
    }
  }
  public get selectors() { return this.style.selectors; }

  protected _orientation: GridOrientation;
  protected set orientation(value: GridOrientation) { this._orientation = value; }
  public get orientation() : GridOrientation { return this._orientation; }

  protected _offset: GridOffset;
  protected set offset(value: GridOffset) { this._offset = value; }
  public get offset() : GridOffset { return this._offset; }

  protected _elements?: GridElements;
  protected set elements(value: GridElements) { this._elements = value; }
  public get elements() : GridElements|undefined { return this._elements; }

  protected _data: Record<string, any>;
  protected set data(value: Record<string, any>) { this._data = value; }
  public get data() : Record<string, any> { return this._data; }

  constructor(args: GridArguments) {
    if (typeof (args.ids as GridIdsProperties).grid === 'number') {
      this.ids = new GridIds(args.ids, (args.ids as GridIdsProperties).grid);
    } else {
      this.ids = new GridIds(args.ids, Register.id());
    }
    this.size = args.size;

    this.orientation = args.orientation;
    this.offset = args.offset;

    this.initTiles(args.tiles);
  }

  // @ts-ignore 'static' modifier cannot be used with 'abstract' modifier.
  public static abstract import(snapshot: GridSnapshot) : AbstractGrid;
  protected static importSnapshot<G extends AbstractGrid>(gridClass: new (args: GridArguments) => G, snapshot: GridSnapshot) : G {
    let instance = new gridClass(snapshot);
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: GridMutation) : void {
    mergeDeep(this.data, mangleProperty(mutation, 'data'));
  }

  public abstract export() : GridSnapshot;
  protected exportSnapshot() : GridSnapshot {
    return this.exportMutables(this.exportConstants()) as GridSnapshot;
  }
  protected exportConstants(object: object = {}) : GridConstants {
    demangleProperties(object, [
      ['ids', demangleGridIds(this.ids)],
      ['size', demangleSize(this.size)],
      ['orientation', this.orientation],
      ['offset', this.offset],
      ['schema', demangleGridStyleSchema(this.schema)],
      ['tiles', this.tiles.map(row => row.map(tile => tile.export()))]
    ]);
    return object as GridConstants;
  }
  protected exportMutables(object: object = {}) : GridMutables {
    demangleProperties(object, [
      ['data', this.data]
    ]);
    return object as GridMutables;
  }

  protected abstract initTiles(snapshot?: TileSnapshot[][]): void;

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        frame: document.createElement('div'),
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: [],
        innerRows: [],
        contour: document.createElement('div'),
        contourHover: document.createElement('div')
      }

      this.elements.frame.classList.add('elemap-' + this.ids.map + '-grid-frame');

      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid-outer');

      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid-inner');

      this.elements.contour.classList.add('elemap-' + this.ids.map + '-grid-contour');
      this.elements.contour.appendChild(this.elements.contourHover);
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let i in this.tiles) {
      if (typeof this.elements!.outerRows[i] === 'undefined') {
        this.elements!.outerRows[i] = document.createElement('div');
        this.elements!.outer.appendChild(this.elements!.outerRows[i]);
      }
      if (typeof this.elements!.innerRows[i] === 'undefined') {
        this.elements!.innerRows[i] = document.createElement('div');
        this.elements!.inner.appendChild(this.elements!.innerRows[i]);
      }
      for (let j in this.tiles[i]) {
        this.tiles[Number(i)]![Number(j)]!.render();
      }
    }

    container.appendChild(this.elements!.frame);
    container.appendChild(this.elements!.outer);
    container.appendChild(this.elements!.inner);
    container.appendChild(this.elements!.contour);

    this.elements!.inner.addEventListener('mouseover', e => {
      let tileElement = (e.target as HTMLElement).closest(this.selectors.innerTile);
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.hover();
      }
    });
    
    this.elements!.inner.addEventListener('mouseout', e => {
      let tileElement = (e.target as HTMLElement).closest(this.selectors.innerTile);
      if (tileElement) {
        this.tileByElement(tileElement as HTMLElement)!.unhover();
      }
    });
  }

  public setContourPosition(position: OrthogonalCoords|false) {
    if (position === false) {
      this.elements!.contourHover.removeAttribute('style');
    } else {
      this.elements!.contourHover.style.display = `block`;
      this.elements!.contourHover.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }
}