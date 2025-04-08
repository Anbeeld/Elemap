import { AbstractTile } from './tile.js';
import { AbstractGrid } from './grid.js';
import { Config } from "./utils.js";

import { SurfaceStyleGroup, SurfaceStyleSet, GridStyleGroup } from './style/set.js';
import { MapIds, Register } from './register.js';

interface MapElements {
  container?: HTMLElement,
  surface?: HTMLElement,
  cssStatic: HTMLElement,
  cssDynamic: HTMLElement
}

export abstract class AbstractMap {
  protected _ids: MapIds;
  public get ids() : MapIds { return this._ids; }

  protected _elements: MapElements;
  public get elements() : MapElements { return this._elements; }

  protected _style: SurfaceStyleSet;
  public get style() : SurfaceStyleSet { return this._style; }

  constructor(config: Config, style: SurfaceStyleSet) {
    this._ids = new MapIds(Register.id());
    Register.add(this);
    config; // TODO
    this._style = style;
    this._elements = this._initElements();

    this._elements.cssStatic.innerHTML = this.cssStatic;
  }

  private _initElements() : MapElements {
    let elementStyleStatic = document.createElement('style');
    elementStyleStatic.classList.add('elemap-' + this.ids.self + '-css-static');
    document.head.appendChild(elementStyleStatic);

    let elementStyleDynamic = document.createElement('style');
    elementStyleDynamic.classList.add('elemap-' + this.ids.self + '-css-dynamic');
    document.head.appendChild(elementStyleDynamic);

    return {
      cssStatic: elementStyleStatic,
      cssDynamic: elementStyleDynamic
    };
  }

  public initRender(container: HTMLElement) {
    for (let element of document.getElementsByClassName('elemap-' + this.ids.self + '-container')) {
      if (element === container) {
        continue;
      }
      element.classList.remove('elemap-' + this.ids.self + '-container');
    }
    if (this.elements.container !== container) {
      this.elements.container = container;
      this.elements.container.classList.add('elemap-' + this.ids.self + '-container');
    }
    
    if (!this.elements.surface) {
      this.elements.surface = document.createElement('div');
      this.elements.surface.classList.add('elemap-' + this.ids.self + '-surface');
    }

    this.elements.container.appendChild(this.elements.surface);
  }

  public get cssStatic() : string {
    return `` +
    `.elemap-${this.ids.self}-container{` +
      `width:max-content;` +
    `}` +

    `.elemap-${this.ids.self}-surface{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:10;` +
    `}`;
  }

  public get cssDynamic() : string {
    return `` +
    `.elemap-${this.ids.self}-surface{` +
      this.style.outer.regular.css +
    `}` +

    `.elemap-${this.ids.self}-surface>*{` +
      this.style.inner.regular.css +
    `}`;
  }
}

export abstract class AbstractGridMap<Grid extends AbstractGrid<AbstractTile>> extends AbstractMap {
  protected _grid: Grid;
  public get grid() : Grid { return this._grid; }

  constructor(config: Config, style: SurfaceStyleGroup, gridClass: new (mapIds: MapIds, config: Config, style: GridStyleGroup) => Grid) {
    super(config, style.self);
    this._grid = new gridClass(this.ids, config, style.grid);

    this.elements.cssStatic.innerHTML = this.cssStatic + this.grid.cssStatic;
  }

  public render(container: HTMLElement) {
    this.initRender(container);
    this.grid.render(this.elements.surface!);
    this.elements.cssDynamic.innerHTML = this.cssDynamic + this.grid.cssDynamic;
  }
}