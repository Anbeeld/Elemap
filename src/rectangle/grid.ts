import { AbstractGrid, GridArguments, GridSnapshot } from "../grid.js";
import { RectangleTile, RectangleTileSnapshot } from "./tile.js";
import { OrthogonalCoords, SignedTable} from "../utils.js";
import { TileArguments } from "src/tile.js";

export type RectangleGridSnapshot = Omit<GridSnapshot, 'tiles'> & {
  tiles: SignedTable<RectangleTileSnapshot>
}

export class RectangleGrid extends AbstractGrid<RectangleTile> {
  constructor(args: GridArguments) {
    super(args);
  }
  
  public static import(snapshot: RectangleGridSnapshot) : RectangleGrid {
    return this.importSnapshot(RectangleGrid, snapshot);
  }
  public override export() : RectangleGridSnapshot {
    return this.exportSnapshot() as RectangleGridSnapshot;
  }

  protected override tileFactory(args: TileArguments<OrthogonalCoords>): RectangleTile {
    return new RectangleTile(args);
  }
  protected override tileImport(snapshot: RectangleTileSnapshot) { return RectangleTile.import(snapshot); }
  protected override tileCoordsFromOrthogonal(coords: OrthogonalCoords): OrthogonalCoords {
    return coords;
  }

  public override tileByCoords(firstCoord: number, secondCoord: number) : RectangleTile|undefined {
    if (!this.tiles[secondCoord]) {
      return undefined;
    } else if (!this.tiles[secondCoord]![firstCoord]) {
      return undefined;
    }
    return this.tiles[secondCoord]![firstCoord];
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