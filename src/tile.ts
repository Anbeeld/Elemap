import { Coords, getCoordsCol, getCoordsRow, mergeDeep, Mutables, Mutation, OrthogonalCoords } from './utils.js';
import { demangleProperties, demangleTileIds, demangleTileStyleDecls, mangleTileSnapshot, demangleCoords, mangleTileStyleDecls } from './mangle.js';
import { cssValueToNumber } from './style/utils.js';
import { GridIdsProperties, Register, TileIds, TileIdsProperties } from './register.js';
import TileStyle from './style/tile.js';
import { modifyTileStyleDecls, CustomTileStyleDecls, TileStyleDecls } from './style/schema.js';

// Snapshot and mutation types
export type TileSnapshot<C extends Coords = Coords> = TileConstants<C> & Mutables;
export type TileConstants<C extends Coords = Coords> = {
  ids: TileIdsProperties,
  coords: C,
  decls: TileStyleDecls | false // false = use grid default tile style
};

export type TileArguments<C extends Coords = Coords> = Omit<TileConstants<C>, 'ids'> & {
  ids: GridIdsProperties | TileIdsProperties
};

type TileElements = {
  outer?: HTMLElement,
  inner: HTMLElement,
  style?: HTMLElement
}

export abstract class AbstractTile<C extends Coords = Coords> implements TileConstants<C>, Mutables {
  protected _ids: TileIds;
  protected set ids(value: TileIds) { this._ids = value; }
  public get ids() : TileIds { return this._ids; }

  public get grid() { return Register.grid.abstract(this.ids)!; }

  protected _style: TileStyle|undefined;
  protected set style(value: TileStyle) { this._style = value; }
  public get style() : TileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Register.style.tile(this.ids)!;
    }
  }
  public get decls() : TileStyleDecls { return this.style.decls; }

  protected _elements: TileElements;
  protected set elements(value: TileElements) { this._elements = value; }
  public get elements() : TileElements { return this._elements; }
  
  protected _coords: C;
  protected set coords(value: C) { this._coords = value; }
  public get coords() : C { return this._coords; }
  
  protected abstract get orthogonalCoords() : OrthogonalCoords;

  protected rendered: boolean = false;

  protected _data: Record<string, any> = {};
  protected set mutables(value: Record<string, any>) { this._data = value; }
  public get mutables() : Record<string, any> { return this._data; }

  constructor(args: TileArguments<C>) {
    if (typeof (args.ids as TileIdsProperties).tile === 'number') {
      this.ids = new TileIds(args.ids, (args.ids as TileIdsProperties).tile);
    } else {
      this.ids = new TileIds(args.ids, Register.id());
    }
    this.coords = args.coords;
  }

  // @ts-ignore 'static' modifier cannot be used with 'abstract' modifier.
  public static abstract import(snapshot: TileSnapshot) : AbstractTile;
  protected static importSnapshot<T extends AbstractTile, C extends Coords>(tile: new (args: TileArguments<C>) => T, snapshot: TileSnapshot) : T {
    let instance = new tile(mangleTileSnapshot<C>(snapshot));
    instance.mutate(snapshot);
    return instance;
  }
  public mutate(mutation: Mutation) : void {
    mergeDeep(this.mutables, mutation);
  }

  public abstract export() : TileSnapshot<C>;
  protected exportSnapshot() : TileSnapshot<C> {
    return this.exportMutables(this.exportConstants()) as TileSnapshot<C>;
  }
  protected exportConstants(object: object = {}) : TileConstants<C> {
    demangleProperties(object, [
      ['ids', demangleTileIds(this.ids)],
      ['coords', demangleCoords<C>(this.coords)],
      ['decls', this._style !== undefined ? demangleTileStyleDecls(this.decls) : false],
      ['mutables', this.mutables]
    ]);
    return object as TileConstants<C>;
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

  protected abstract createStyle(decls: CustomTileStyleDecls) : TileStyle;

  public updateStyle(decls: CustomTileStyleDecls, replace: boolean = false) : void {
    decls = mangleTileStyleDecls(decls);
    if (this._style === undefined || replace) {
      this.style = this.createStyle(modifyTileStyleDecls(decls));
    } else {
      this.style = this.createStyle(modifyTileStyleDecls(decls, this.decls));
    }    

    if (this.rendered) {
      this.render();
    }
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div')
      }
    }
    if (this._style !== undefined && !this.style.initial) {
      if (!this.elements.style) {
        this.elements.style = document.createElement('style');
        this.elements.style.classList.add('elemap-' + this.ids.map + '-css-tile-' + this.ids.tile);
      }
      if (!this.elements.outer && (this.decls.outer.length || this.decls.hover.outer.length)) {
        this.elements.outer = document.createElement('div');
      }
    }
  }
  protected abstract setCoordsAttributes() : void;

  public render() : void {
    let outer = this.grid.elements!.outerRows[getCoordsRow(this.coords)]!;
    let inner = this.grid.elements!.innerRows[getCoordsRow(this.coords)]!;

    this.initElements();

    this.setCoordsAttributes();

    if (this.elements!.style) {
      this.elements.style.innerHTML = this.style.core + this.style.schema + this.style.generated;
      document.head.appendChild(this.elements.style);
    }
    if (this.elements!.outer) {
      if (!outer.contains(this.elements!.outer)) {
        outer.appendChild(this.elements!.outer);
      }
    }
    if (!inner.contains(this.elements!.inner)) {
      inner.appendChild(this.elements!.inner);
    }

    this.rendered = true;
  }

  public hover() : void {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(this.elementOffset)
    }
  }
  public unhover() : void {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get elementOffset() : OrthogonalCoords {
    let grid = Register.grid.abstract(this.ids);
    if (grid) {
      let element = this.elements!.inner;
      let offset: OrthogonalCoords = {x: 0, y: 0};
      while (element) {
        offset.x += element.offsetLeft;
        offset.y += element.offsetTop;
        element = element.parentElement as HTMLElement;
        if (element === grid.elements!.inner) {
          return {
            x: offset.x - cssValueToNumber(grid.style.spacing),
            y: offset.y - cssValueToNumber(grid.style.spacing)
          }
        }
      }
    }
    return {
      x: 0,
      y: 0
    };
  }

  public abstract get selectors() : {[key: string]: string};

  public get indexInRow() : number {
    if (this.grid.tiles[getCoordsRow(this.coords)]) {
      let minIndex;
      for (let [i, tile] of this.grid.tiles[getCoordsRow(this.coords)]!) {
        tile; // TODO
        if (minIndex === undefined || i < minIndex) {
          minIndex = i;
        }
      }
      if (minIndex !== undefined) {
        return minIndex + getCoordsCol(this.coords);
      }
    }
    return 0;
  }
}