import { MapIds, Register, MapStyleIds } from "../register.js";
import { MapStyleDecls, StyleDecls } from "./set.js";
import Style from "./style.js";
import GridStyle from "./grid.js";

type StyleElements = {
  static: HTMLElement,
  schema: HTMLElement,
  dynamic: HTMLElement
}

type MapComputed = {
  map: CSSStyleDeclaration,
}

export abstract class MapStyle extends Style {
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

    let elementStyleSchema = document.createElement('style');
    elementStyleSchema.classList.add(this.owner.classes.base + '-css-schema');
    document.head.appendChild(elementStyleSchema);

    let elementStyleDynamic = document.createElement('style');
    elementStyleDynamic.classList.add(this.owner.classes.base + '-css-dynamic');
    document.head.appendChild(elementStyleDynamic);

    return {
      static: elementStyleStatic,
      schema: elementStyleSchema,
      dynamic: elementStyleDynamic
    }
  }

  public render() {
    this.elements.static.innerHTML = this.static;
    this.elements.schema.innerHTML = this.schema;

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

  protected get schema() : string {
    return `` +
    this.selectors.map + `{` +
      this.decls.outer +
    `}` +

    this.selectors.map + `>*{` +
      this.decls.inner +
    `}`;
  }

  protected compute() : void {
    this.computed = {
      map: getComputedStyle(this.owner.elements.map)
    };
  }

  protected get dynamic() : string { return ``; };
}

export abstract class GridMapStyle extends MapStyle {
  protected _grid: GridStyle;
  protected set grid(value: GridStyle) { this._grid = value; }
  public get grid() : GridStyle { return this._grid; }

  public override get owner() { return Register.map.grid(this.ids.owner)!; }

  public constructor(mapIds: MapIds, decls: StyleDecls) {
    super(mapIds, decls);
    this.initGrid(decls);
  }

  protected abstract initGrid(decls: StyleDecls) : void;

  public override render() {
    this.elements.static.innerHTML = this.static + this.grid.static + this.grid.tile.static;
    this.elements.schema.innerHTML = this.schema + this.grid.schema + this.grid.tile.schema;

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