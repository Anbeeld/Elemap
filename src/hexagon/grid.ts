import { AbstractGrid, GridArguments, GridSnapshot } from "../grid.js";
import { HexagonTile, HexagonTileSnapshot } from "./tile.js";
import { GridOffset, SignedTable, AxialCoords, axialCoordsToCartesian, cartesianCoordsToAxial, CartesianCoords, SignedArray, Size, isCartesianCoords } from "../utils.js";
import { TileArguments } from "../tile.js";

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
  protected override tileCoordsFromCartesian(coords: CartesianCoords): AxialCoords {
    return cartesianCoordsToAxial(coords, this.orientation, this.offset);
  }

  public override tileByCoords(coords: AxialCoords|CartesianCoords|[number, number]) : HexagonTile|undefined {
    if (Array.isArray(coords)) {
      coords = {
        q: coords[0],
        r: coords[1]
      };
    }
    let cartesianCoords = isCartesianCoords(coords) ? coords as CartesianCoords : axialCoordsToCartesian(coords as AxialCoords, this.orientation, this.offset);
    if (!this.tiles[cartesianCoords.y]) {
      return undefined;
    } else if (!this.tiles[cartesianCoords.y]![cartesianCoords.x]) {
      return undefined;
    }
    return this.tiles[cartesianCoords.y]![cartesianCoords.x];
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
  
  public createTile(coords: AxialCoords|CartesianCoords|[number, number]) : void {
    if (Array.isArray(coords)) {
      coords = {
        q: coords[0],
        r: coords[1]
      };
    }
    let cartesianCoords = isCartesianCoords(coords) ? coords as CartesianCoords : axialCoordsToCartesian(coords as AxialCoords, this.orientation, this.offset);
    if (!this.tiles[cartesianCoords.y]) {
      this.tiles[cartesianCoords.y] = new SignedArray<HexagonTile>();
    }
    this.tiles[cartesianCoords.y]![cartesianCoords.x] = this.tileFactory({
      ids: this.ids,
      coords: this.tileCoordsFromCartesian(cartesianCoords),
      decls: false
    });
  }

  public createTiles(size: Size, coords: AxialCoords|CartesianCoords|[number, number]) : void {
    if (Array.isArray(coords)) {
      coords = {
        q: coords[0],
        r: coords[1]
      };
    }
    if (isCartesianCoords(coords)) {
      for (let x = coords.x; x < coords.x + size.width; x++) {
        for (let y = coords.y; y < coords.y + size.height; y++) {
          this.createTile(cartesianCoordsToAxial({x, y}, this.orientation, this.offset));
        }
      }
    } else {
      for (let q = coords.q; q < coords.q + size.width; q++) {
        for (let r = coords.r; r < coords.r + size.height; r++) {
          this.createTile({q, r});
        }
      }
    }
  }

  public hasIndentation(i: number) : boolean {
    if (this.offset === GridOffset.Odd) {
      return i % 2 !== 0;
    } else {
      return i % 2 === 0;
    }
  }
}