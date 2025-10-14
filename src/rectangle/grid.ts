import { AbstractGrid, GridArguments, GridSnapshot } from "../grid.js";
import { RectangleTile, RectangleTileSnapshot } from "./tile.js";
import { CartesianCoords, normalizeSize, SignedArray, SignedTable, Size} from "../utils.js";
import { TileArguments } from "../tile.js";

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

  protected override tileFactory(args: TileArguments<CartesianCoords>): RectangleTile {
    return new RectangleTile(args);
  }
  protected override tileImport(snapshot: RectangleTileSnapshot) { return RectangleTile.import(snapshot); }
  protected override tileCoordsFromCartesian(coords: CartesianCoords): CartesianCoords {
    return coords;
  }

  public createTile(coords: CartesianCoords|[number, number], replace: boolean) : CartesianCoords|false {
    if (Array.isArray(coords)) {
      coords = {
        x: coords[0],
        y: coords[1]
      };
    }
    if (!this.tiles[coords.y]) {
      this.tiles[coords.y] = new SignedArray<RectangleTile>();
    }
    if (replace || !this.tiles[coords.y]![coords.x]) {
      this.tiles[coords.y]![coords.x] = this.tileFactory({
        ids: this.ids,
        coords: this.tileCoordsFromCartesian(coords),
        decls: false
      });
      if (this.map.renderOnChange && this.map.rendered) {
        this.map.render();
      }
      return coords;
    }
    return false;
  }

  public createTiles(coords: CartesianCoords|[number, number], size: Size|[number, number], replace: boolean) :  (CartesianCoords|false)[] {
    size = normalizeSize(size);
    let createdTiles: (CartesianCoords|false)[] = [];
    if (Array.isArray(coords)) {
      coords = {
        x: coords[0],
        y: coords[1]
      };
    }
    for (let x = coords.x; x < coords.x + size.width; x++) {
      for (let y = coords.y; y < coords.y + size.height; y++) {
        createdTiles.push(this.createTile({x, y}, replace));
      }
    }
    if (createdTiles.length > 0) {
      if (this.map.renderOnChange && this.map.rendered) {
        this.map.render();
      }
    }
    return createdTiles;
  }

  public override tileByCoords(coords: CartesianCoords|[number, number]) : RectangleTile|undefined {
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
    if (element.hasAttribute('data-coords-x') && element.hasAttribute('data-coords-y')) {
      let tile = this.tileByCoords({
        x: Number(element.getAttribute('data-coords-x')!),
        y: Number(element.getAttribute('data-coords-y')!)
      });
      if (tile && tile.elements) {
        if ((tile.elements.inner && tile.elements.inner === element) || (tile.elements.outer && tile.elements.outer === element)) {
          return tile;
        }
      }
    }
    return undefined;
  }
  
  public override prepareCoordsInput(coords: CartesianCoords|[number, number]) : CartesianCoords {
    if (Array.isArray(coords)) {
      coords = {
        x: coords[0],
        y: coords[1]
      };
    }
    return coords;
  }
  
  public override deleteTile(coords: CartesianCoords|[number, number]) : boolean {
    let tile = this.tileByCoords(coords);
    if (tile) {
      this.tiles.delete([tile.coords.y, tile.coords.x]);
      if (this.map.renderOnChange && this.map.rendered) {
        this.map.render();
      }
      return true;
    }
    return false;
  }

  public override deleteTiles(coords: CartesianCoords|[number, number], size: Size|[number, number]): boolean[] {
    size = normalizeSize(size);
    let deletedTiles: boolean[] = [];
    if (Array.isArray(coords)) {
      coords = {
        x: coords[0],
        y: coords[1]
      };
    }
    for (let x = coords.x; x < coords.x + size.width; x++) {
      for (let y = coords.y; y < coords.y + size.height; y++) {
        deletedTiles.push(this.deleteTile({x, y}));
      }
    }
    if (deletedTiles.length > 0) {
      if (this.map.renderOnChange && this.map.rendered) {
        this.map.render();
      }
    }
    return deletedTiles;
  }
}