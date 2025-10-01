import { MapIds, Registry, MapStyleIds } from "../registry.js";
import { MapStyleDecls, GridMapStyleSchema, GridStyleSchema } from "./schema.js";
import Style from "./style.js";
import GridStyle from "./grid.js";
import { demangleProperties } from "../mangle.js";

type StyleElements = {
  core: HTMLElement,
  schema: HTMLElement,
  generated: HTMLElement
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

  public constructor(mapIds: MapIds, decls: GridMapStyleSchema) {
    super();
    this.ids = new MapStyleIds(mapIds, Registry.id());
    this.decls = decls.map;
  }

  public export() : MapStyleDecls {
    return demangleProperties(this.decls, [
      ['outer', this.decls.outer],
      ['inner', this.decls.inner],
    ]);
  }

  protected initElements() : StyleElements {
    let elementStyleCore, elementStyleSchema, elementStyleGenerated;

    let headStyles = document.head.getElementsByTagName('style');
    for (let style of headStyles) {
      if (style.classList.contains(this.owner.classes.base + '-css-core')) {
        elementStyleCore = style;
      } else if (style.classList.contains(this.owner.classes.base + '-css-schema')) {
        elementStyleSchema = style;
      } else if (style.classList.contains(this.owner.classes.base + '-css-generated')) {
        elementStyleGenerated = style;
      }
    }

    if (!elementStyleCore) {
      elementStyleCore = document.createElement('style');
      elementStyleCore.classList.add(this.owner.classes.base + '-css-core');
      document.head.appendChild(elementStyleCore);
    }

    if (!elementStyleSchema) {
      elementStyleSchema = document.createElement('style');
      elementStyleSchema.classList.add(this.owner.classes.base + '-css-schema');
      document.head.appendChild(elementStyleSchema);
    }

    if (!elementStyleGenerated) {
      elementStyleGenerated = document.createElement('style');
      elementStyleGenerated.classList.add(this.owner.classes.base + '-css-generated');
      document.head.appendChild(elementStyleGenerated);
    }

    return {
      core: elementStyleCore,
      schema: elementStyleSchema,
      generated: elementStyleGenerated
    }
  }

  public render() {
    this.elements = this.initElements();

    this.elements.core.innerHTML = this.core;
    this.elements.schema.innerHTML = this.schema;

    void(this.owner.elements.map.offsetHeight);

    this.compute();

    this.elements.generated.innerHTML = this.generated;
  }

  public override get selectors() {
    return {
      base: `.elemap-${this.ids.owner.map}`,
      container: `.elemap-${this.ids.owner.map}-container`,
      map: `.elemap-${this.ids.owner.map}-map`,
      content: `.elemap-${this.ids.owner.map}-content`
    };
  }

  protected get core() : string {
    return `` +
    this.selectors.container + `{` +
      `width:max-content;` +
      `position:relative;` +
    `}` +

    this.selectors.map + `{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:10;` +
      `display: flex;` + // Prevent collapsing inner grid margins if outer map padding is 0
    `}` +

    this.selectors.content + `{` +
      `position:absolute;` +
      `z-index:500;` +
      `top:0;` +
      `left:0;` +
      `bottom:0;` +
      `right:0;` +
      `pointer-events:none;` +
    `}` +

    this.selectors.content + `>div{` +
      `width: 0px;height: 0px;position: absolute;overflow:visible` +
    `}` +
    this.selectors.content + `>div>*{` +
      `position: absolute;transform: translate(-50%, -100%);` +
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

  protected get generated() : string { return ``; };
}

export abstract class GridMapStyle extends MapStyle {
  protected _grid: GridStyle;
  protected set grid(value: GridStyle) { this._grid = value; }
  public get grid() : GridStyle { return this._grid; }

  public override get owner() { return Registry.map.grid(this.ids.owner)!; }

  public constructor(mapIds: MapIds, decls: GridMapStyleSchema) {
    super(mapIds, decls);
    this.initGrid(decls as GridStyleSchema);
  }

  protected abstract initGrid(decls: GridStyleSchema) : void;

  public override render() {
    this.elements = this.initElements();
    
    this.elements.core.innerHTML = this.core + this.grid.core + this.grid.tile.core;
    this.elements.schema.innerHTML = this.schema + this.grid.schema + this.grid.tile.schema;

    void(this.owner.elements.map.offsetHeight);
    void(this.owner.grid.elements!.inner.offsetHeight);

    this.compute();

    this.elements.generated.innerHTML = this.generated + this.grid.generated + this.grid.tile.generated;

    this.grid.renderSpecificTiles();

    let headStyles = document.head.getElementsByTagName('style');
    let headStylesArray = Array.from(headStyles);
    for (let style of headStylesArray) {
      for (let className of style.classList) {
        if (className.startsWith(this.owner.classes.base + '-css-')) {
          let isRelevantElement = false;

          if (style === this.elements.core || style === this.elements.schema || style === this.elements.generated) {
            isRelevantElement = true;
          }

          if (!isRelevantElement) {
            for (let row of this.grid.owner.tiles.values) {
              for (let tile of row.values) {
                if (style === tile.elements.style) {
                  isRelevantElement = true;
                  break;
                }
              }
              if (isRelevantElement) {
                break;
              }
            }
          }

          if (!isRelevantElement) {
            style.remove();
          }
        }
      }
    }
  }

  protected override compute() : void {
    this.computed = {
      map: getComputedStyle(this.owner.elements.map)
    };
    this.grid.compute();
  }
}