import { AbstractGrid } from "./grid.js";
import { AbstractGridMap, AbstractMap } from "./map.js";
import { AbstractTile } from "./tile.js";

abstract class Ids {
  public readonly map: number;
  constructor(self: number) {
    this.map = self;
  }
}

export class MapIds extends Ids {
  public get self() { return this.map; }
}

export class GridIds extends MapIds {
  public readonly grid: number;
  public override get self() { return this.grid; }
  constructor(mapIds: MapIds, self: number) {
    super(mapIds.map);
    this.grid = self;
  }
}

export class TileIds extends GridIds {
  public readonly tile: number;
  public override get self() { return this.tile; }
  constructor(gridIds: GridIds, self: number) {
    super(gridIds as MapIds, gridIds.grid);
    this.tile = self;
  }
}

export class Register {
  private static _id: number = 0;
  public static id() : number { return Register._id++; }
  
  private static _maps: Map<number, AbstractMap> = new Map();
  public static add(map: AbstractMap) : void {
    Register._maps.set(map.ids.self, map);
  }
  public static map(ids: MapIds) : AbstractMap|undefined {
    return Register._maps.get(ids.map);
  }
  public static grid(ids: MapIds) : AbstractGrid<AbstractTile>|undefined {
    let map = Register.map(ids);
    if (map && map instanceof AbstractGridMap) {
      return map.grid;
    }
    return undefined;
  }
}