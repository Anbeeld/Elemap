import { AbstractGrid, GridArguments, GridSnapshot } from "../grid.js";
import { HexagonTile, HexagonTileSnapshot } from "./tile.js";
import { GridOffset, SignedTable, AxialCoords, axialCoordsToOrthogonal, orthogonalCoordsToAxial, OrthogonalCoords } from "../utils.js";
import { TileArguments } from "src/tile.js";

export type HexagonGridSnapshot = Omit<GridSnapshot, 'tiles'> & {
  tiles: SignedTable<HexagonTileSnapshot>
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
  
  protected override tileFactory(args: TileArguments<AxialCoords>): HexagonTile {
    return new HexagonTile(args);
  }
  protected override tileImport(snapshot: HexagonTileSnapshot) { return HexagonTile.import(snapshot); }
  protected override tileCoordsFromOrthogonal(coords: OrthogonalCoords): AxialCoords {
    return orthogonalCoordsToAxial(coords, this.orientation, this.offset);
  }

  public override tileByCoords(coords: AxialCoords|[number, number]) : HexagonTile|undefined {
    if (Array.isArray(coords)) {
      coords = {
        q: coords[0],
        r: coords[1]
      };
    }
    let orthogonalCoords = axialCoordsToOrthogonal(coords, this.orientation, this.offset);
    if (!this.tiles[orthogonalCoords.y]) {
      return undefined;
    } else if (!this.tiles[orthogonalCoords.y]![orthogonalCoords.x]) {
      return undefined;
    }
    return this.tiles[orthogonalCoords.y]![orthogonalCoords.x];
  }
  public override tileByElement(element: HTMLElement) : HexagonTile|undefined {
    if (element.hasAttribute('data-elemap-r') && element.hasAttribute('data-elemap-q')) {
      return this.tileByCoords({
        q: Number(element.getAttribute('data-elemap-q')!),
        r: Number(element.getAttribute('data-elemap-r')!)
      });
    }
    return undefined;
  }

  public hasIndentation(i: number) : boolean {
    if (this.offset === GridOffset.Odd) {
      return i % 2 !== 0;
    } else {
      return i % 2 === 0;
    }
  }
}