import { TileSizeSet } from "../utils.js";
import { TileStyleIds, GridStyleIds, Register, TileIds } from "../register.js";
import { TileStyleDecls } from "./set.js";
import Style from "./style.js";
import { calc } from "./utils.js";

type TileComputed = {
  // outer: CSSStyleDeclaration,
  inner: CSSStyleDeclaration,
}

export default abstract class TileStyle extends Style {
  protected _ids: TileStyleIds;
  protected set ids(value: TileStyleIds) { this._ids = value; }
  public get ids() : TileStyleIds { return this._ids; }

  public override get owner() { return Register.tile.abstract(this.ids.owner)!; }

  public get grid() { return Register.style.grid(this.ids.owner)!; }

  public initial: boolean;

  protected get spacing() : string { return this.grid.spacing; }

  protected _computed: TileComputed;
  protected set computed(value: TileComputed) { this._computed = value; }
  public get computed() : TileComputed { return this._computed; }

  public override get selectors() {
    return {
      ...this.grid.selectors,
      data: this.initial ? `` : this.owner.selectors.data
    };
  }

  protected _decls: TileStyleDecls;
  protected set decls(value: TileStyleDecls) { this._decls = value; }
  public get decls() : TileStyleDecls { return this._decls; }

  public constructor(ownerIds: TileIds, gridIds: GridStyleIds, decls: TileStyleDecls, initial: boolean = false) {
    super();
    this.ids = new TileStyleIds(ownerIds, gridIds, Register.id());
    this.initial = initial;
    this.decls = decls;
  }

  public get size() : TileSizeSet {
    let inner = {
      width: this.computed.inner.width,
      height: this.computed.inner.height
    };
    let spaced = {
      width: calc.add(inner.width, calc.mult(this.spacing, 2)),
      height: calc.add(inner.height, calc.mult(this.spacing, 2))
    };
    let outer = {
      width: calc.add(inner.width, this.spacing),
      height: calc.add(inner.height, this.spacing)
    };

    return { spaced, outer, inner };
  }

  public get static() : string { return ''; }

  public get rules() : string {
    let css = ``;

    if (this.decls.outer.length) {
      css +=
      this.selectors.outerTile + this.selectors.data + `{` +
        this.decls.outer +
      `}`;
    }

    if (this.decls.inner.length) {
      css +=
      this.selectors.innerTile + this.selectors.data + `{` +
        this.decls.inner +
      `}`;
    }

    // TODO hover won't work
    if (this.decls.hover.outer.length) {
      css +=
      this.selectors.outerTile + this.selectors.data + `:hover{` +
        this.decls.hover.outer + 
      `}`;
    }

    if (this.decls.hover.inner.length) {
      css +=
      this.selectors.innerTile + this.selectors.data + `:hover{` +
        this.decls.hover.inner + 
      `}`;
    }

    return css;
  }

  public get dynamic() : string {
    let css = ``;

    if (this.initial) {
      css +=
      this.selectors.contour + `>div{` + 
        `border:none;` +
      `}`;

      css += this.outerPosition;
    }

    return css;
  }

  // Outer elements use absolute positioning
  public get outerPosition() : string {
    let css = ``;
    for (let rows of this.owner.grid.tiles) {
      for (let tile of rows) {
        css +=
        this.selectors.outerTile + tile.selectors.data + `{` +
          `left:${calc.mult(this.size.outer.width, tile.index!.j)};` +
        `}`; 
      }
    }
    return css;
  }

  public compute() : void {
    this.computed = {
      // outer: getComputedStyle(this.owner.grid.tileByCoords(0, 0)!.elements.outer),
      inner: getComputedStyle(this.owner.grid.tileByCoords(0, 0)!.elements.inner)
    };
  }
}