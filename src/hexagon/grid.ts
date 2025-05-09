import { AbstractGrid } from "../grid.js";
import HexagonTile from "./tile.js";
import { Config, indexToAxialCoords, axialCoordsToOrthogonal, orthogonalCoordsToIndex, GridOffset } from "../utils.js";
import { MapIds } from "../register.js";

export default class HexagonGrid extends AbstractGrid<HexagonTile> {
  constructor(mapIds: MapIds, config: Config) {
    super(mapIds, config);
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

  public hasIntendation(i: number) : boolean {
    if (this.offset === GridOffset.Odd) {
      return i % 2 === 1;
    } else {
      return i % 2 === 0;
    }
  }
}