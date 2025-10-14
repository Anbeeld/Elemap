import { Coords, getCoordsRow, mergeDeep, Extendable, Extensions, CartesianCoords, deleteExtensions, UpdateStyleMode } from './utils.js';
import { demangleProperties, demangleTileIds, demangleTileStyleDecls, mangleTileSnapshot, demangleCoords, demangleProperty } from './mangle.js';
import { cssValueToNumber } from './style/utils.js';
import { GridIdsProperties, Registry, TileIds, TileIdsProperties } from './registry.js';
import TileStyle from './style/tile.js';
import { modifyTileStyleDecls, CustomTileStyleDecls, TileStyleDecls } from './style/schema.js';

// Snapshot and extension types
export type TileSnapshot<C extends Coords = Coords> = TileProperties<C> & Extendable;
export type TileProperties<C extends Coords = Coords> = {
  ids: TileIdsProperties,
  coords: C,
  decls: TileStyleDecls | "mannequin" | false, // false = use grid default tile style
  visible?: boolean
};

export type TileArguments<C extends Coords = Coords> = Omit<TileProperties<C>, 'ids'> & {
  ids: GridIdsProperties | TileIdsProperties
};

export type TileElements = {
  outer?: HTMLElement,
  inner: HTMLElement,
  style?: HTMLElement
}

export abstract class AbstractTile<C extends Coords = Coords> implements TileProperties<C>, Extendable {
  protected _ids: TileIds;
  protected set ids(value: TileIds) { this._ids = value; }
  public get ids() : TileIds { return this._ids; }

  public get grid() { return Registry.grid.abstract(this.ids)!; }

  protected _style: TileStyle|undefined;
  protected set style(value: TileStyle) { this._style = value; }
  public get style() : TileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Registry.style.tile(this.ids)!;
    }
  }
  public get decls() : TileStyleDecls { return this.style.decls; }

  protected _elements: TileElements;
  protected set elements(value: TileElements) { this._elements = value; }
  public get elements() : TileElements { return this._elements; }
  
  protected _coords: C;
  protected set coords(value: C) { this._coords = value; }
  public get coords() : C { return this._coords; }
  
  public abstract get cartesianCoords() : CartesianCoords;

  protected rendered: boolean = false;
  
  protected _visible: boolean = true;
  protected set visible(value: boolean) { this._visible = value; }
  public get visible() : boolean { return this._visible; }

  protected _extensions: Extensions = {};
  protected set extensions(value: Extensions) { this._extensions = value; }
  public get extensions() : Extensions { return this._extensions; }

  constructor(args: TileArguments<C>) {
    if (typeof (args.ids as TileIdsProperties).tile === 'number') {
      this.ids = new TileIds(args.ids, (args.ids as TileIdsProperties).tile);
      Registry.update(this.ids.tile);
    } else {
      this.ids = new TileIds(args.ids, Registry.id());
    }
    this.coords = args.coords;

    if (args.visible === false) {
      this.visible = args.visible;
    }

    if (args.decls && args.decls !== "mannequin") {
      this.updateStyle(args.decls);
    }
  }

  // 'static' modifier cannot be used with 'abstract' modifier.
  // public static abstract import(snapshot: TileSnapshot) : AbstractTile;
  protected static importSnapshot<T extends AbstractTile, C extends Coords>(tile: new (args: TileArguments<C>) => T, snapshot: TileSnapshot) : T {    
    let mangledSnapshot = mangleTileSnapshot(snapshot);
    let instance = new tile(mangledSnapshot as unknown as TileArguments<C>);
    instance.addExtensions(mangledSnapshot.extensions);
    return instance;
  }
  public addExtensions(extensions: Extensions) : void {
    mergeDeep(this.extensions, extensions);
  }
  
  public deleteExtensions(extensions: string[]) : void {
    deleteExtensions(this.extensions, extensions);
  }

  public abstract export() : TileSnapshot<C>;
  protected exportSnapshot() : TileSnapshot<C> {
    return this.exportExtensions(this.exportProperties()) as TileSnapshot<C>;
  }
  protected exportProperties(object: object = {}) : TileProperties<C> {
    demangleProperties(object, [
      ['ids', demangleTileIds(this.ids)],
      ['coords', demangleCoords<C>(this.coords)],
      ['decls', this._style !== undefined ? demangleTileStyleDecls(this.decls) : false],
      ['visible', this.visible]
    ]);
    return object as TileProperties<C>;
  }
  protected exportExtensions(object: object = {}) : Extendable {
    demangleProperties(object, [
      ['extensions', this.extensions]
    ]);
    return object as Extendable;
  }

  protected abstract createStyle(decls: CustomTileStyleDecls) : TileStyle;

  public updateStyle(decls: CustomTileStyleDecls, mode: UpdateStyleMode = 'add') : void {
    if (mode === 'remove') {
      if (this._style) {
        this.style = this.createStyle(modifyTileStyleDecls(decls, this.decls, true));
      }
    } else {
      if (this._style === undefined || mode === 'replace') {
        this.style = this.createStyle(modifyTileStyleDecls(decls));
      } else {
        this.style = this.createStyle(modifyTileStyleDecls(decls, this.decls));
      }
    }

    if (this.grid.map.renderOnChange && this.rendered) {
      this.render();
      this.renderSpecific();
    }
  }

  protected initElements() : void {
    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div')
      }
    }
  }
  protected abstract setCoordsAttributes() : void;

  public render() : void {
    if (this.style.mannequin && this.style.owner === this) {
      this.renderMannequin();
    } else {
      let outer = this.grid.elements!.outerRows[getCoordsRow(this.cartesianCoords)]!;
      let inner = this.grid.elements!.innerRows[getCoordsRow(this.cartesianCoords)]!;

      this.initElements();

      this.setCoordsAttributes();

      if (this.elements!.outer) {
        if (!outer.contains(this.elements!.outer)) {
          outer.appendChild(this.elements!.outer);
        }
      }
      if (!inner.contains(this.elements!.inner)) {
        inner.appendChild(this.elements!.inner);
      }
    }

    if (!this.visible) {
      this.elements.outer?.classList.add(this.grid.classes.tileHidden);
      this.elements.inner.classList.add(this.grid.classes.tileHidden);
    } else {
      this.elements.outer?.classList.remove(this.grid.classes.tileHidden);
      this.elements.inner.classList.remove(this.grid.classes.tileHidden);
    }

    this.rendered = true;
  }

  protected renderMannequin() : void {
    let outer = this.grid.elements!.mannequin.outerRow;
    let inner = this.grid.elements!.mannequin.innerRow;

    if (!this.elements) {
      this.elements = {
        inner: document.createElement('div'),
        outer: document.createElement('div')
      }
    }

    this.elements!.outer!.classList.add(this.grid.classes.mannequin);
    this.grid.map.addIdToDataset(this.elements!.outer!);
    this.elements!.inner.classList.add(this.grid.classes.mannequin);
    this.grid.map.addIdToDataset(this.elements!.inner);

    if (!outer.contains(this.elements!.outer!)) {
      outer.appendChild(this.elements!.outer!);
    }
    if (!inner.contains(this.elements!.inner)) {
      inner.appendChild(this.elements!.inner);
    }
  }

  public renderSpecific() : void {
    if (this._style !== undefined && !this.style.mannequin) {
      if (!this.elements.style) {
        let headStyles = document.head.getElementsByTagName('style');
        for (let style of headStyles) {
          if (style.classList.contains('elemap-' + this.ids.map + '-css-tile-' + this.ids.tile) && style.hasAttribute('data-map-id') && style.getAttribute('data-map-id') === this.ids.map.toString() && style.hasAttribute('data-tile-id') && style.getAttribute('data-tile-id') === this.ids.tile.toString()) {
            this.elements.style = style;
          }
        }

        if (!this.elements.style) {
          this.elements.style = document.createElement('style');
          this.elements.style.classList.add('elemap-css-tile');
          this.grid.map.addIdToDataset(this.elements.style);
          this.addIdToDataset(this.elements.style);
          document.head.appendChild(this.elements.style);
        }
      }

      if (!this.elements.outer && (this.decls.outer.length || this.decls.hover.outer.length)) {
        this.elements.outer = document.createElement('div');

        let outer = this.grid.elements!.outerRows[getCoordsRow(this.cartesianCoords)]!;
        this.setCoordsAttributes();
        if (this.elements!.outer) {
          if (!outer.contains(this.elements!.outer)) {
            outer.appendChild(this.elements!.outer);
          }
        }
      }
    }
    if (this.elements!.style) {
      this.elements.style.innerHTML = this.style.core + this.style.schema + this.style.generated;
    }
  }

  public addIdToDataset(element: HTMLElement) {
    demangleProperty(element.dataset, 'tileId', this.ids.tile.toString());
  }

  public hover() : void {
    if (!this.visible) {
      return;
    }

    let grid = Registry.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(this.elementOffset)
    }
  }
  public unhover() : void {
    let grid = Registry.grid.abstract(this.ids);
    if (grid) {
      grid.setContourPosition(false);
    }
  }

  protected get elementOffset() : CartesianCoords {
    let grid = Registry.grid.abstract(this.ids);
    if (grid) {
      let element = this.elements!.inner;
      let offset: CartesianCoords = {x: 0, y: 0};
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

  public toggleVisibility(state?: boolean) : boolean {
    if (state !== undefined) {
      this.visible = state;
    } else {
      this.visible = !this.visible;
    }

    if (this.grid.map.renderOnChange && this.rendered) {
      this.grid.map.render();
    }

    return this.visible;
  }

  public abstract get neighbors() : AbstractTile[];

  public abstract get diagonals() : AbstractTile[];
}