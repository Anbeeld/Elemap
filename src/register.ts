import { AbstractGrid } from "./grid.js";
import HexagonGrid from "./hexagon/grid.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import RectangleGrid from "./rectangle/grid.js";
import GridStyle from "./style/grid.js";
import { GridMapStyle } from "./style/map.js";
import { AbstractTile } from "./tile.js";

export abstract class Ids {
  public readonly map: number;
  constructor(mapId: number) {
    this.map = mapId;
  }
}
export class MapIds extends Ids {
}
export class GridIds extends MapIds {
  public readonly grid: number;
  constructor(mapIds: MapIds, gridId: number) {
    super(mapIds.map);
    this.grid = gridId;
  }
}

export class TileIds extends GridIds {
  public readonly tile: number;
  constructor(gridIds: GridIds, tileId: number) {
    super(gridIds as MapIds, gridIds.grid);
    this.tile = tileId;
  }
}

export abstract class StyleIds {
  public readonly owner: MapIds;
  public readonly map: number;
  constructor(owner: MapIds, mapId: number) {
    this.owner = owner;
    this.map = mapId;
  }
}
export class MapStyleIds extends StyleIds {
}
export class GridStyleIds extends MapStyleIds {
  public readonly grid: number;
  constructor(mapIds: MapStyleIds, gridId: number) {
    super(mapIds.owner, mapIds.map);
    this.grid = gridId;
  }
}
export class TileStyleIds extends GridStyleIds {
  public readonly tile: number;
  constructor(gridIds: GridStyleIds, tileId: number) {
    super(gridIds as MapStyleIds, gridIds.grid);
    this.tile = tileId;
  }
}

export class Register {
  private static _id: number = 0;
  public static id() : number { return Register._id++; }
  
  private static maps: Map<number, AbstractMap> = new Map();
  public static add(map: AbstractMap) : void {
    Register.maps.set(map.ids.map, map);
  }
  public static map(ids: MapIds) : AbstractMap|undefined {
    return Register.maps.get(ids.map);
  }

  public static grid = {
    abstract: (ids: MapIds) : AbstractGrid<AbstractTile>|undefined => {
      let map = Register.map(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
    rectangle: (ids: MapIds) : RectangleGrid|undefined => {
      let map = Register.map(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
    hexagon: (ids: MapIds) : HexagonGrid|undefined => {
      let map = Register.map(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
  }

  public static style = {
    map: {
      grid: (ids: MapIds) : GridMapStyle|undefined => {
        let map = Register.map(ids);
        if (map && map instanceof AbstractGridMap) {
          return map.style;
        }
        return undefined;
      }
    },
    grid: (ids: MapIds) : GridStyle|undefined => {
      let map = Register.map(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.style.grid;
      }
      return undefined;
    }
  }
}