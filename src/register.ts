import { AbstractGrid } from "./grid.js";
import HexagonGrid from "./hexagon/grid.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import RectangleGrid from "./rectangle/grid.js";
import GridStyle from "./style/grid.js";
import { GridMapStyle } from "./style/map.js";
import TileStyle from "./style/tile.js";
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
  constructor(ownerIds: MapIds, mapId: number) {
    this.owner = ownerIds;
    this.map = mapId;
  }
}
export class MapStyleIds extends StyleIds {
}
export class GridStyleIds extends MapStyleIds {
  public override readonly owner: GridIds;
  public readonly grid: number;
  constructor(ownerIds: GridIds, mapIds: MapIds, gridId: number) {
    super(ownerIds, mapIds.map);
    this.grid = gridId;
  }
}
export class TileStyleIds extends GridStyleIds {
  public override readonly owner: TileIds;
  public readonly tile: number;
  constructor(ownerIds: TileIds, gridIds: GridStyleIds, tileId: number) {
    super(ownerIds, gridIds, tileId);
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

  public static map = {
    abstract: (ids: MapIds) : AbstractMap|undefined => {
      return Register.maps.get(ids.map);
    },
    grid: (ids: MapIds) : AbstractGridMap<AbstractGrid<AbstractTile>>|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        return map;
      }
      return undefined;
    },
  }

  public static grid = {
    abstract: (ids: MapIds) : AbstractGrid<AbstractTile>|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
    rectangle: (ids: MapIds) : RectangleGrid|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
    hexagon: (ids: MapIds) : HexagonGrid|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.grid;
      }
      return undefined;
    },
  }

  public static tile = {
    abstract: (ids: TileIds) : AbstractTile|undefined => {
      let grid = Register.grid.abstract(ids);
      if (grid) {
        return grid.tileById(ids);
      }
      return undefined;
    },
  }

  public static style = {
    map: {
      grid: (ids: MapIds) : GridMapStyle|undefined => {
        let map = Register.map.abstract(ids);
        if (map && map instanceof AbstractGridMap) {
          return map.style;
        }
        return undefined;
      }
    },
    grid: (ids: MapIds) : GridStyle|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        return map.style.grid;
      }
      return undefined;
    },
    tile: (ids: MapIds) : TileStyle|undefined => {
      let map = Register.map.abstract(ids);
      if (map && map instanceof AbstractGridMap) {
        if (map.style.grid && map.style.grid instanceof GridStyle) {
          return map.style.grid.tile;
        }
      }
      return undefined;
    }
  }
}