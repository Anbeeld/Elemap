import { AbstractTile, TileArguments, TileSnapshot } from "./tile.js";
import { Size, GridOrientation, GridOffset, CartesianCoords, mergeDeep, Mutations, Mutation, SignedArray, SignedTable, Coords } from "./utils.js";
import { GridIds, GridIdsProperties, MapIdsProperties, Registry, TileIds } from "./registry.js";
import { GridStyleSchema } from "./style/schema.js";
import { demangleProperties, demangleGridIds, demangleGridStyleSchema, demangleProperty } from "./mangle.js";

// Snapshot and mutation types
export type GridSnapshot = GridConstants & Mutations;
type GridConstants = {
  ids: GridIdsProperties,
  orientation: GridOrientation,
  offset: GridOffset,
  schema: GridStyleSchema | false, // false = use map default grid and tile style
  tiles: SignedTable<TileSnapshot>
};

export type GridArguments = Omit<GridConstants, 'ids'> & {
  ids: MapIdsProperties | GridIdsProperties
};

interface GridElements {
  frame: HTMLElement;
  outer: HTMLElement;
  inner: HTMLElement;
  outerRows: SignedArray<HTMLElement>;
  innerRows: SignedArray<HTMLElement>;
  mannequin: {
    outerRow: HTMLElement;
    outerTile: HTMLElement;
    innerRow: HTMLElement;
    innerTile: HTMLElement
  }
  contour: HTMLElement;
  contourHover: HTMLElement;
}

export abstract class AbstractGrid<T extends AbstractTile = AbstractTile> implements GridConstants, Mutations {
  protected _ids: GridIds;
  protected set ids(value: GridIds) { this._ids = value; }
  public get ids() : GridIds { return this._ids; }

  public get size() : Size {
    return {
      width: this.extremes.x.max - this.extremes.x.min + 1,
      height: this.extremes.y.max - this.extremes.y.min + 1
    };
  }

  public get extremes() : {x: {min: number, max: number}, y: {min: number, max: number}} {
    let minY, maxY, minX, maxX;
    for (let y of this.tiles.keys) {

      if (minY === undefined || y < minY) {
        minY = y;
      }
      if (maxY === undefined || y > maxY) {
        maxY = y;
      }

      for (let x of this.tiles[y]!.keys) {
        if (minX === undefined || x < minX) {
          minX = x;
        }
        if (maxX === undefined || x > maxX) {
          maxX = x;
        }
      }
    }
    return {
      x: {min: minX || 0, max: maxX || 0},
      y: {min: minY || 0, max: maxY || 0}
    };
  }

  public tiles: SignedTable<T> = new SignedTable<T>();
  public mannequin: T;

  public abstract tileByCoords(coords: Coords|[number, number]) : T|undefined;
  public abstract tileByElement(element: HTMLElement) : T|undefined;
  public tileById(ids: TileIds) : T|undefined {
    if (this.mannequin.ids.tile === ids.tile) {
      return this.mannequin;
    }
    for (let y in this.tiles) {
      for (let x in this.tiles[y]) {
        if (this.tiles[y]![x as any]!.ids.tile === ids.tile) {
          return this.tiles[y]![x as any]!;
        }
      }
    }
    return undefined;
  }

  public get style() { return Registry.map.grid(this.ids)!.style.grid; }
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

  protected _mutations: Record<string, any> = {};
  protected set mutations(value: Record<string, any>) { this._mutations = value; }
  public get mutations() : Record<string, any> { return this._mutations; }

  constructor(args: GridArguments) {
    if (typeof (args.ids as GridIdsProperties).grid === 'number') {
      this.ids = new GridIds(args.ids, (args.ids as GridIdsProperties).grid);
    } else {
      this.ids = new GridIds(args.ids, Registry.id());
    }

    this.orientation = args.orientation;
    this.offset = args.offset;
  }

  // 'static' modifier cannot be used with 'abstract' modifier.
  // public static abstract import(snapshot: GridSnapshot) : AbstractGrid;
  protected static importSnapshot<G extends AbstractGrid>(gridClass: new (args: GridArguments) => G, snapshot: GridSnapshot) : G {
    let instance = new gridClass(snapshot);
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: Mutation) : void {
    mergeDeep(this.mutations, mutation);
  }

  public abstract export() : GridSnapshot;
  protected exportSnapshot() : GridSnapshot {
    return this.exportMutations(this.exportConstants()) as GridSnapshot;
  }
  protected exportConstants(object: object = {}) : GridConstants {
    let tiles: SignedTable<TileSnapshot> = new SignedArray<SignedArray<TileSnapshot>>();
    for (let [y, row] of this.tiles) {
      tiles[y] = new SignedArray<TileSnapshot>();

      for (let [x, tile] of row) {
        tiles[y][x] = tile.export();
      }
    }

    demangleProperties(object, [
      ['ids', demangleGridIds(this.ids)],
      ['orientation', this.orientation],
      ['offset', this.offset],
      ['schema', demangleGridStyleSchema(this.schema)],
      ['tiles', tiles]
    ]);
    return object as GridConstants;
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

  public importTiles(snapshot: SignedTable<TileSnapshot>) : void {
    for (let [y, row] of snapshot) {
      for (let [x, tile] of row) {
        if (!this.tiles[y]) {
          this.tiles[y] = new SignedArray<T>();
        }
        this.tiles[y][x] = this.tileImport(tile);
      }
    }
  }

  public abstract createTile(coords: Coords|[number, number], replace: boolean) : void;

  public abstract createTiles(size: Size, coords: Coords|[number, number], replace: boolean) : void;

  protected abstract tileFactory(args: TileArguments) : T;
  protected abstract tileImport(snapshot: TileSnapshot) : T;
  protected abstract tileCoordsFromCartesian(coords: CartesianCoords) : Coords;

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        frame: document.createElement('div'),
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: new SignedArray<HTMLElement>(),
        innerRows: new SignedArray<HTMLElement>(),
        contour: document.createElement('div'),
        contourHover: document.createElement('div'),
        mannequin: {
          outerRow: document.createElement('div'),
          outerTile: document.createElement('div'),
          innerRow: document.createElement('div'),
          innerTile: document.createElement('div')
        }
      }

      this.elements.frame.classList.add('elemap-' + this.ids.map + '-grid-frame');

      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.outer.classList.add('elemap-' + this.ids.map + '-grid-outer');

      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid');
      this.elements.inner.classList.add('elemap-' + this.ids.map + '-grid-inner');

      this.elements.contour.classList.add('elemap-' + this.ids.map + '-grid-contour');
      this.elements.contour.appendChild(this.elements.contourHover);

      this.elements.mannequin.outerRow.classList.add('elemap-' + this.ids.map + '-mannequin');
      this.elements.outer.appendChild(this.elements.mannequin.outerRow);

      this.elements.mannequin.innerRow.classList.add('elemap-' + this.ids.map + '-mannequin');
      this.elements.inner.appendChild(this.elements.mannequin.innerRow);

      this.style.tile.owner.render();
    }
  }

  public render(container: HTMLElement) {
    this.initElements();

    container.innerHTML = '';

    for (let row in this.elements!.outerRows) {
      for (let element of this.elements!.outerRows[row]!.children) {
        if (!this.tileByElement(element as HTMLElement)) {
          this.elements!.outerRows[row]!.removeChild(element);
        }
      }
    }
    for (let row in this.elements!.innerRows) {
      for (let element of this.elements!.innerRows[row]!.children) {
        if (!this.tileByElement(element as HTMLElement)) {
          this.elements!.innerRows[row]!.removeChild(element);
        }
      }
    }

    for (let [y, row] of this.tiles) {
      if (typeof this.elements!.outerRows[y] === 'undefined') {
        this.elements!.outerRows[y] = document.createElement('div');
        demangleProperty(this.elements!.outerRows[y].dataset, 'elemapY', y.toString());
        this.elements!.outer.appendChild(this.elements!.outerRows[y]);
      }
      if (typeof this.elements!.innerRows[y] === 'undefined') {
        this.elements!.innerRows[y] = document.createElement('div');
        demangleProperty(this.elements!.innerRows[y].dataset, 'elemapY', y.toString());
        this.elements!.inner.appendChild(this.elements!.innerRows[y]);
      }
      for (let tile of row.values) {
        tile.render();
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

  public setContourPosition(position: CartesianCoords|false) {
    if (position === false) {
      this.elements!.contourHover.removeAttribute('style');
    } else {
      this.elements!.contourHover.style.display = `block`;
      this.elements!.contourHover.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }
}