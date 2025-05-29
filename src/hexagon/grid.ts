import { AbstractGrid, GridArguments, GridSnapshot } from "../grid.js";
import { HexagonTile, HexagonTileSnapshot } from "./tile.js";
import { indexToAxialCoords, axialCoordsToOrthogonal, orthogonalCoordsToIndex, GridOffset } from "../utils.js";

export type HexagonGridSnapshot = Omit<GridSnapshot, 'tiles'> & {
  tiles: HexagonTileSnapshot[][]
}

export class HexagonGrid extends AbstractGrid<HexagonTile> {
  constructor(args: GridArguments) {
    super(args);
  }

  public static import(snapshot: HexagonGridSnapshot) : HexagonGrid {
    return this.importSnapshot(HexagonGrid, snapshot);
  }
  public override export() : HexagonGridSnapshot {
    return this.exportSnapshot() as HexagonGridSnapshot;
  }

  protected override initTiles() : void {
    for (let i = 0; i < this.size.height; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < this.size.width; j++) {
        this.tiles[i]![j] = new HexagonTile({
          ids: this.ids,
          index: {i, j},
          coords: indexToAxialCoords({i, j}, this.orientation, this.offset),
          decls: false
        });
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