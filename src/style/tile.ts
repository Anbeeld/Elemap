import { Style, StyleDecls, StyleProps, StyleTypes } from "./style.js";
import { Background, BackgroundValues } from './css/background.js';
import { SizeValues, Width } from "./css/size.js";

/* OUTER */

export interface TileOuterStyleDecls extends StyleDecls {
  background?: BackgroundValues;

}

export interface TileOuterStyleProps extends StyleProps {
  background: Background,
}

export class TileOuterStyle extends Style<TileOuterStyleDecls, TileOuterStyleProps> {
  constructor(values: TileOuterStyleDecls) {
    const types: StyleTypes = {
      background: Background,
    }

    super(types, values);
  }
}

/* INNER */

export interface TileInnerStyleDecls extends StyleDecls {
  background?: BackgroundValues;
}

export interface TileInnerStyleProps extends StyleProps {
  background: Background;
}

export class TileInnerStyle extends Style<TileInnerStyleDecls, TileInnerStyleProps> {
  constructor(values: TileInnerStyleDecls) {
    const types: StyleTypes = {
      background: Background,
    }

    super(types, values);
  }
}

/* CONTOUR */

export interface TileContourStyleDecls extends StyleDecls {
  width?: SizeValues|string;
  background?: BackgroundValues;
}

export interface TileContourStyleProps extends StyleProps {
  width: Width;
  background: Background;
}

export class TileContourStyle extends Style<TileContourStyleDecls, TileContourStyleProps> {
  constructor(values: TileContourStyleDecls) {
    const types: StyleTypes = {
      width: Width,
      background: Background,
    }

    super(types, values);
  }
}