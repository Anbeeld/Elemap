import { AbstractGrid, GridSnapshot } from "../grid.js";
import { RectangleTile, RectangleTileSnapshot } from "./tile.js";
import { indexToOrthogonalCoords, MapType, orthogonalCoordsToIndex/*, TileSize */ } from "../utils.js";
import { MapIds } from "../register.js";
import { Config } from "../config.js";

type RectangleGridSnapshot = GridSnapshot & {
  tiles: RectangleTileSnapshot[][]
}

export default class RectangleGrid extends AbstractGrid<RectangleTile> {
  constructor(mapIds: MapIds, config: Config) {
    super(mapIds, config);
  }
  
  public static import(snapshot: RectangleGridSnapshot) : RectangleGrid {
    return new RectangleGrid(snapshot.ids, {
      type: MapType.Rectangle,
      size: snapshot.size,
      grid: {
        orientation: snapshot.orientation,
        offset: snapshot.offset
      }
    });
  }

  public override export() : RectangleGridSnapshot {
    return {
      ids: this.ids,
      size: this.size,
      orientation: this.orientation,
      offset: this.offset,
      tiles: this.tiles.map(row => row.map(tile => tile.export()))
    };
  }

  protected override initTiles() : void {
    for (let i = 0; i < this.size.height; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.size.width; j++) {
        this.tiles[i]![j] = new RectangleTile(this.ids, {i, j}, indexToOrthogonalCoords({i, j}));
      }
    }
  }

  public override tileByCoords(firstCoord: number, secondCoord: number) : RectangleTile|undefined {
    let index = orthogonalCoordsToIndex({x: firstCoord, y: secondCoord});
    return this.tileByIndex(index.i, index.j);
  }
  
  public override tileByElement(element: HTMLElement) : RectangleTile|undefined {
    if (element.hasAttribute('data-elemap-x') && element.hasAttribute('data-elemap-y')) {
      return this.tileByCoords(
        Number(element.getAttribute('data-elemap-x')!),
        Number(element.getAttribute('data-elemap-y')!)
      );
    }
    return undefined;
  }
}