import { AbstractGrid } from "../grid.js";
import RectangleTile from "./tile.js";
import { Config, /* generateRectanglePath, */ indexToOrthogonalCoords, orthogonalCoordsToIndex/*, TileSize */ } from "../utils.js";
// import { StyleDecls } from "../style/set.js";
import { MapIds } from "../register.js";

export default class RectangleGrid extends AbstractGrid<RectangleTile> {
  constructor(mapIds: MapIds, config: Config) {
    super(mapIds, config);
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