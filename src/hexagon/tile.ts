import { AbstractTile, TileArguments, TileSnapshot } from '../tile.js';
import { AxialCoords, setAxialCoordsProperties, setProperty } from '../utils.js';
import { Register } from '../register.js';
import { TileStyleDecls } from '../style/schema.js';
import HexagonTileStyle from '../style/hexagon/tile.js';

export type HexagonTileSnapshot = TileSnapshot<AxialCoords>;

export class HexagonTile extends AbstractTile<AxialCoords> {
  constructor(args: TileArguments<AxialCoords>) {
    super(args);
  }

  public static import(snapshot: HexagonTileSnapshot) : HexagonTile {
    return this.importSnapshot(HexagonTile, snapshot);
  }
  public override export() : HexagonTileSnapshot {
    return this.exportSnapshot();
  }
  protected override exportCoords(): AxialCoords {
    return setAxialCoordsProperties(this.coords);
  }
    
  protected override _style: HexagonTileStyle|undefined;
  protected override set style(value: HexagonTileStyle) { this._style = value; }
  public override get style() : HexagonTileStyle {
    if (this._style !== undefined) {
      return this._style;
    } else {
      return Register.style.tile(this.ids)!;
    }
  }

  protected override createStyle(decls: TileStyleDecls) : HexagonTileStyle {
    return new HexagonTileStyle(this.ids, this.grid.style.ids, decls);
  }

  protected override setCoordsAttributes() {    
    if (this.elements!.outer) {
      setProperty(this.elements!.outer.dataset, 'elemapR', this.coords.r.toString());
      setProperty(this.elements!.outer.dataset, 'elemapQ', this.coords.q.toString());
    }
    setProperty(this.elements!.inner.dataset, 'elemapR', this.coords.r.toString());
    setProperty(this.elements!.inner.dataset, 'elemapQ', this.coords.q.toString());
  }
  
  public get selectors() {
    return {
      data: `[data-elemap-r="${this.coords.r}"][data-elemap-q="${this.coords.q}"]`
    };
  }
}