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

  public override tileByCoords(coords: OrthogonalCoords|[number, number]) : RectangleTile|undefined {
    if (Array.isArray(coords)) {
      coords = {
        x: coords[0],
        y: coords[1]
      };
    }
    if (!this.tiles[coords.y]) {
      return undefined;
    } else if (!this.tiles[coords.y]![coords.x]) {
      return undefined;
    }
    return this.tiles[coords.y]![coords.x];
  }
  public override tileByElement(element: HTMLElement) : RectangleTile|undefined {
    if (element.hasAttribute('data-elemap-x') && element.hasAttribute('data-elemap-y')) {
      return this.tileByCoords({
        x: Number(element.getAttribute('data-elemap-x')!),
        y: Number(element.getAttribute('data-elemap-y')!)
      });
    }
    return undefined;
  }
}