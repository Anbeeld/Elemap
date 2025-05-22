import { AbstractGrid, GridSnapshot } from "../grid.js";
import { HexagonTile, HexagonTileSnapshot } from "./tile.js";
import { indexToAxialCoords, axialCoordsToOrthogonal, orthogonalCoordsToIndex, GridOffset, MapType } from "../utils.js";
import { MapIds } from "../register.js";
import { Config } from "../config.js";

type HexagonGridSnapshot = GridSnapshot & {
  tiles: HexagonTileSnapshot[][]
}

export default class HexagonGrid extends AbstractGrid<HexagonTile> {
  constructor(mapIds: MapIds, config: Config) {
    super(mapIds, config);
  }

  public static import(snapshot: HexagonGridSnapshot) : HexagonGrid {
    return new HexagonGrid(snapshot.ids, {
      type: MapType.Hexagon,
      size: snapshot.size,
      grid: {
        orientation: snapshot.orientation,
        offset: snapshot.offset
      }
    });
  }

  public override export() : HexagonGridSnapshot {
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
        this.tiles[i]![j] = new HexagonTile(this.ids, {i, j}, indexToAxialCoords({i, j}, this.orientation, this.offset));
      }
    }
  }
  
  public override tileByCoords(firstCoord: number, secondCoord: number) : HexagonTile|undefined {
    let index = orthogonalCoordsToIndex(axialCoordsToOrthogonal({r: firstCoord, q: secondCoord}, this.orientation, this.offset));
    return this.tileByIndex(index.i, index.j);
  }

  public override tileByElement(element: HTMLElement) : HexagonTile|undefined {
    if (element.hasAttribute('data-elemap-r') && element.hasAttribute('data-elemap-q')) {
      return this.tileByCoords(
        Number(element.getAttribute('data-elemap-r')!),
        Number(element.getAttribute('data-elemap-q')!)
      );
    }
    return undefined;
  }

  public hasIndentation(i: number) : boolean {
    if (this.offset === GridOffset.Odd) {
      return i % 2 === 1;
    } else {
      return i % 2 === 0;
    }
  }
}