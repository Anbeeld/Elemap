import Raoi from 'raoi';

import { AbstractTile } from './tile.js';
import { AbstractGrid } from './grid.js';
import { Config } from "./utils.js";

import { SurfaceStyleGroup, SurfaceStyleSet, GridStyleGroup } from './style/set.js';

interface MapElements {
  container?: HTMLElement,
  surface?: HTMLElement,
  cssStatic: HTMLElement,
  cssDynamic: HTMLElement
}

export abstract class AbstractMap {
  protected _id: number;
  public get id() : number { return this._id; }

  protected _elements: MapElements;
  public get elements() : MapElements { return this._elements; }

  protected _style: SurfaceStyleSet;
  public get style() : SurfaceStyleSet { return this._style; }

  constructor(config: Config, style: SurfaceStyleSet) {
    this._id = Raoi.new(this);
    config; // TODO
    this._style = style;
    this._elements = this.initElements();

    this._elements.cssStatic.innerHTML = this.cssStatic;
  }

  private initElements() : MapElements {
    let elementStyleStatic = document.createElement('style');
    elementStyleStatic.classList.add('elemap-css-static-' + this.id);
    document.head.appendChild(elementStyleStatic);

    let elementStyleDynamic = document.createElement('style');
    elementStyleDynamic.classList.add('elemap-css-dynamic-' + this.id);
    document.head.appendChild(elementStyleDynamic);

    return {
      cssStatic: elementStyleStatic,
      cssDynamic: elementStyleDynamic
    };
  }

  public initRender(container: HTMLElement) {
    for (let element of document.getElementsByClassName('elemap-container-' + this.id)) {
      if (element === container) {
        continue;
      }
      element.classList.remove('elemap-container-' + this.id);
    }
    if (this.elements.container !== container) {
      this.elements.container = container;
      this.elements.container.classList.add('elemap-container-' + this.id);
    }
    
    if (!this.elements.surface) {
      this.elements.surface = document.createElement('div');
      this.elements.surface.classList.add('elemap-surface-' + this.id);
    }

    this.elements.container.appendChild(this.elements.surface);
  }

  public get cssStatic() : string {
    return `` +
    `.elemap-grid-${this.id}{` +
      `width:max-content;` +
      `overflow:hidden;` +
    `}` +

    `.elemap-container-${this.id}{` +
      `width:max-content;` +
    `}` +

    `.elemap-surface-${this.id}{` +
      `position:relative;` +
      `width:max-content;` +
      `z-index:10;` +
    `}`;
  }

  public get cssDynamic() : string {
    return `` +
    `.elemap-surface-${this.id}{` +
      this.style.outer.regular.css +
    `}` +

    `.elemap-surface-${this.id}>*{` +
      this.style.inner.regular.css +
    `}`;
  }
}

export abstract class AbstractGridMap<Grid extends AbstractGrid<AbstractTile>> extends AbstractMap {
  protected _grid: Grid;
  public get grid() : Grid { return this._grid; }

  constructor(config: Config, style: SurfaceStyleGroup, gridClass: new (mapId: number, config: Config, style: GridStyleGroup) => Grid) {
    super(config, style.self);
    this._grid = new gridClass(this.id, config, style.grid);

    this.elements.cssStatic.innerHTML = this.cssStatic + this.grid.cssStatic;
  }

  public render(container: HTMLElement) {
    this.initRender(container);
    this.grid.render(this.elements.surface!);
    this.elements.cssDynamic.innerHTML = this.cssDynamic + this.grid.cssDynamic;
  }
}