import { MapIds, Register, MapStyleIds, GridIds } from "../register.js";
import { MapStyleDecls, StyleDecls } from "./set.js";
import Style from "./style.js";
import GridStyle from "./grid.js";
import { AbstractGridMap } from "../map.js";
import { AbstractGrid } from "../grid.js";
import { AbstractTile } from "../tile.js";
import { printStyleDecl } from "./utils.js";

type StyleElements = {
  static: HTMLElement,
  rules: HTMLElement,
  dynamic: HTMLElement
}

type MapComputed = {
  map: CSSStyleDeclaration,
}

export class MapStyle extends Style {
  protected _ids: MapStyleIds;
  protected set ids(value: MapStyleIds) { this._ids = value; }
  public get ids() : MapStyleIds { return this._ids; }

  protected _decls: MapStyleDecls;
  protected set decls(value: MapStyleDecls) { this._decls = value; }
  public get decls() : MapStyleDecls { return this._decls; }

  protected _elements: StyleElements;
  protected set elements(value: StyleElements) { this._elements = value; }
  public get elements() : StyleElements { return this._elements; }

  protected _computed: MapComputed;
  protected set computed(value: MapComputed) { this._computed = value; }
  public get computed() : MapComputed { return this._computed; }

  public constructor(mapIds: MapIds, decls: StyleDecls) {
    super();
    this.ids = new MapStyleIds(mapIds, Register.id());
    this.decls = decls.map;
    this.elements = this.initElements();
  }

  protected initElements() : StyleElements {
    let elementStyleStatic = document.createElement('style');
    elementStyleStatic.classList.add(this.owner.classes.base + '-css-static');
    document.head.appendChild(elementStyleStatic);

    let elementStyleRules = document.createElement('style');
    elementStyleRules.classList.add(this.owner.classes.base + '-css-rules');
    document.head.appendChild(elementStyleRules);

    let elementStyleDynamic = document.createElement('style');
    elementStyleDynamic.classList.add(this.owner.classes.base + '-css-dynamic');
    document.head.appendChild(elementStyleDynamic);

    return {
      static: elementStyleStatic,
      rules: elementStyleRules,
      dynamic: elementStyleDynamic
    }
  }

  public render() {
    this.elements.static.innerHTML = this.static;
    this.elements.rules.innerHTML = this.rules;

    void(this.owner.elements.map.offsetHeight);

    this.compute();

    this.elements.dynamic.innerHTML = this.dynamic;
  }

  public override get selectors() {
    return {
      base: `.elemap-${this.ids.owner.map}`,
      container: `.elemap-${this.ids.owner.map}-container`,
      map: `.elemap-${this.ids.owner.map}-map`
    };
  }

  protected get static() : string {
    return `` +
    this.selectors.container + `{` +
      `width:max-content;` +
    `}` +

    this.selectors.map + `{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:10;` +
    `}`;
  }

  protected get rules() : string {
    return `` +
    this.selectors.map + `{` +
      printStyleDecl(this.decls.outer) +
    `}` +

    this.selectors.map + `>*{` +
      printStyleDecl(this.decls.inner) +
    `}`;
  }

  protected compute() : void {
    this.computed = {
      map: getComputedStyle(this.owner.elements.map)
    };
  }

  protected get dynamic() : string { return ``; };
}

export class GridMapStyle extends MapStyle {
  protected _grid: GridStyle;
  protected set grid(value: GridStyle) { this._grid = value; }
  public get grid() : GridStyle { return this._grid; }

  public override get owner() { return Register.map(this.ids.owner)! as AbstractGridMap<AbstractGrid<AbstractTile>>; }

  public constructor(mapIds: MapIds, decls: StyleDecls, gridClass: new (ownerIds: GridIds, mapIds: MapStyleIds, decls: StyleDecls) => GridStyle) {
    super(mapIds, decls);
    this.grid = new gridClass(this.owner.grid.ids, this.ids, decls);
  }

  public override render() {
    this.elements.static.innerHTML = this.static + this.grid.static + this.grid.tile.static;
    this.elements.rules.innerHTML = this.rules + this.grid.rules + this.grid.tile.rules;

    void(this.owner.elements.map.offsetHeight);
    void(this.owner.grid.elements!.inner.offsetHeight);

    this.compute();

    this.elements.dynamic.innerHTML = this.dynamic + this.grid.dynamic + this.grid.tile.dynamic;
  }

  protected override compute() : void {
    this.computed = {
      map: getComputedStyle(this.owner.elements.map)
    };
    this.grid.compute();
  }
}