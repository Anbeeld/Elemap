import { AbstractTile } from '../tile.js';
import { AxialCoords, Index, setProperty } from '../utils.js';
import { GridIds, Register } from '../register.js';
import { TileStyleDecls } from '../style/schema.js';
import HexagonTileStyle from '../style/hexagon/tile.js';

export default class HexagonTile extends AbstractTile {  
  protected override _coords: AxialCoords;
  protected override set coords(value: AxialCoords) { this._coords = value; }
  public override get coords() : AxialCoords { return this._coords; }

  constructor(gridIds: GridIds, index: Index, coords: AxialCoords) {
    super(gridIds, index);
    this.coords = coords;
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