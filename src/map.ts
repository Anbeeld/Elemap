import { AbstractTile } from './tile.js';
import { AbstractGrid, GridSnapshot } from './grid.js';

import { GridMapStyleSchema } from './style/schema.js';
import { MapStyle, GridMapStyle } from './style/map.js';
import { MapIds, Register } from './register.js';
import { Config } from './config.js';
import { MapType } from './utils.js';

interface MapElements {
  container?: HTMLElement,
  map: HTMLElement,
}

type MapSnapshot = {
  ids: MapIds
}

export type GridMapSnapshot = MapSnapshot & {
  type: MapType,
  grid: GridSnapshot
}

export abstract class AbstractMap {
  protected _ids: MapIds;
  protected set ids(value: MapIds) { this._ids = value; }
  public get ids() : MapIds { return this._ids; }

  protected _elements: MapElements;
  protected set elements(value: MapElements) { this._elements = value; }
  public get elements() : MapElements { return this._elements; }

  protected _style: MapStyle;
  protected set style(value: MapStyle) { this._style = value; }
  public get style() : MapStyle { return this._style; }

  public get classes() {
    return {
      base: `elemap-${this.ids.map}`,
      container: `elemap-${this.ids.map}-container`,
      map: `elemap-${this.ids.map}-map`
    };
  }

  constructor(config: Config) {
    this.ids = new MapIds(Register.id());
    Register.add(this);
    config; // TODO
  }

  // 'static' modifier cannot be used with 'abstract' modifier.
  // public static abstract import(snapshot: MapSnapshot) : AbstractMap;
  public abstract export() : MapSnapshot;

  protected abstract initStyle(style: GridMapStyleSchema) : void;

  protected initElements() : MapElements {    
    let elementMap = document.createElement('div');
    elementMap.classList.add(`elemap-${this.ids.map}-map`);

    return {
      map: elementMap
    };
  }

  public initRender(container: HTMLElement) {
    for (let element of document.getElementsByClassName('elemap-' + this.ids.map + '-container')) {
      if (element === container) {
        continue;
      }
      element.classList.remove('elemap-' + this.ids.map + '-container');
    }
    if (this.elements.container !== container) {
      this.elements.container = container;
      this.elements.container.classList.add('elemap-' + this.ids.map + '-container');
    }

    this.elements.container.appendChild(this.elements.map);
  }

  public render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.style.render();
  }
}

export abstract class AbstractGridMap<Grid extends AbstractGrid<AbstractTile>> extends AbstractMap {
  protected _grid: Grid;
  protected set grid(value: Grid) { this._grid = value; }
  public get grid() : Grid { return this._grid; }

  protected override _style: GridMapStyle;
  protected override set style(value: GridMapStyle) { this._style = value; }
  public override get style() : GridMapStyle { return this._style; }

  constructor(config: Config, style: GridMapStyleSchema, gridClass: new (mapIds: MapIds, config: Config) => Grid) {
    super(config);
    this.grid = new gridClass(this.ids, config);
    this.initStyle(style);
  }

  public override render(container: HTMLElement) {
    this.elements = this.initElements();
    this.initRender(container);
    this.grid.render(this.elements.map!);
    this.style.render();
  }
}