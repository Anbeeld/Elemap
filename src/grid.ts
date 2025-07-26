import { AbstractTile, TileArguments, TileSnapshot } from "./tile.js";
import { Size, GridOrientation, GridOffset, OrthogonalCoords, mergeDeep, Mutables, Mutation, SignedArray, SignedTable, Coords, Index } from "./utils.js";
import { GridIds, GridIdsProperties, MapIdsProperties, Register, TileIds } from "./register.js";
import { GridStyleSchema } from "./style/schema.js";
import { demangleProperties, demangleSize, demangleGridIds, demangleGridStyleSchema } from "./mangle.js";

// Snapshot and mutation types
export type GridSnapshot = GridConstants & Mutables;
type GridConstants = {
  ids: GridIdsProperties,
  size: Size,
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
  contour: HTMLElement;
  contourHover: HTMLElement;
}

export abstract class AbstractGrid<T extends AbstractTile = AbstractTile> implements GridConstants, Mutables {
  protected _ids: GridIds;
  protected set ids(value: GridIds) { this._ids = value; }
  public get ids() : GridIds { return this._ids; }

  protected _size: Size;
  protected set size(value: Size) { this._size = value; }
  public get size() : Size { return this._size; }

  public tiles: SignedTable<T> = new SignedTable<T>();

  public abstract tileByCoords(firstCoord: number, secondCoord: number) : T|undefined;
  public abstract tileByElement(element: HTMLElement) : T|undefined;
  public tileById(ids: TileIds) : T|undefined {
    for (let x in this.tiles) {
      for (let y in this.tiles[x]) {
        if (this.tiles[x]![y as any]!.ids.tile === ids.tile) {
          return this.tiles[x]![y as any]!;
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

  protected _data: Record<string, any> = {};
  protected set mutables(value: Record<string, any>) { this._data = value; }
  public get mutables() : Record<string, any> { return this._data; }

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
  public mutate(mutation: Mutation) : void {
    mergeDeep(this.mutables, mutation);
  }

  public abstract export() : GridSnapshot;
  protected exportSnapshot() : GridSnapshot {
    return this.exportMutables(this.exportConstants()) as GridSnapshot;
  }
  protected exportConstants(object: object = {}) : GridConstants {
    let tiles: SignedTable<TileSnapshot> = new SignedArray<SignedArray<TileSnapshot>>();
    for (let [i, row] of this.tiles) {
      tiles[i] = new SignedArray<TileSnapshot>();

      for (let [j, tile] of row) {
        tiles[i][j] = tile.export();
      }
    }

    demangleProperties(object, [
      ['ids', demangleGridIds(this.ids)],
      ['size', demangleSize(this.size)],
      ['orientation', this.orientation],
      ['offset', this.offset],
      ['schema', demangleGridStyleSchema(this.schema)],
      ['tiles', tiles]
    ]);
    return object as GridConstants;
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

  protected initTiles(snapshot?: SignedTable<TileSnapshot>) : void {
    if (snapshot) {
      for (let [x, row] of snapshot) {
        for (let [y, tile] of row) {
          if (!this.tiles[x]) {
            this.tiles[x] = new SignedArray<T>();
          }
          this.tiles[x][y] = this.tileImport(tile);
        }
      }
    } else {
      for (let x = 0; x < this.size.height; x++) {
        for (let y = 0; y < this.size.width; y++) {
          if (!this.tiles[x]) {
            this.tiles[x] = new SignedArray<T>();
          }
          this.tiles[x]![y] = this.tileFactory({
            ids: this.ids,
            coords: this.indexToCoords({i: x, j: y}),
            decls: false
          });
        }
      }
    }
  }

  protected abstract tileFactory(args: TileArguments) : T;
  protected abstract tileImport(snapshot: TileSnapshot) : T;
  protected abstract indexToCoords(index: Index) : Coords;

  public get tilesLimits() : {rows: {min: number, max: number}, cols: {min: number, max: number}} {
    let minCol, maxCol;
    for (let [i, row] of this.tiles) {
      i; // TODO
      for (let [j, tile] of row) {
        tile; // TODO
        if (minCol === undefined || j < minCol) {
          minCol = j;
        }
        if (maxCol === undefined || j > maxCol) {
          maxCol = j;
        }
      }
    }
    return {
      rows: {min: 0, max: 0},
      cols: {min: minCol || 0, max: maxCol || 0}
    };
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        frame: document.createElement('div'),
        outer: document.createElement('div'),
        inner: document.createElement('div'),
        outerRows: new SignedArray<HTMLElement>(),
        innerRows: new SignedArray<HTMLElement>(),
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

    for (let x in Object.keys(this.tiles)) {
      if (typeof this.elements!.outerRows[x] === 'undefined') {
        this.elements!.outerRows[x] = document.createElement('div');
        this.elements!.outer.appendChild(this.elements!.outerRows[x]);
      }
      if (typeof this.elements!.innerRows[x] === 'undefined') {
        this.elements!.innerRows[x] = document.createElement('div');
        this.elements!.inner.appendChild(this.elements!.innerRows[x]);
      }
      for (let [y, tile] of this.tiles[x]!) {
        y; // TODO
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

  public setContourPosition(position: OrthogonalCoords|false) {
    if (position === false) {
      this.elements!.contourHover.removeAttribute('style');
    } else {
      this.elements!.contourHover.style.display = `block`;
      this.elements!.contourHover.style.transform = `translate(${position.x}px, ${position.y}px)`;
    }
  }
}