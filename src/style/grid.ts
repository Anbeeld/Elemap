import { Style, StyleDecls, StyleProps, StyleTypes } from "./style.js";
import { Width, Height, SizeValues, Spacing } from "./css/size.js";
import { BorderRadius, BorderRadiusValues } from './css/border-radius.js';

/* OUTER */

export interface GridOuterStyleDecls extends StyleDecls {
  width?: SizeValues|string;
  height?: SizeValues|string;
  spacing?: SizeValues|string;
  borderRadius?: BorderRadiusValues|string;
}

export interface GridOuterStyleProps extends StyleProps {
  width: Width;
  height: Height;
  spacing: Spacing;
  borderRadius: BorderRadius;
}

export class GridOuterStyle extends Style<GridOuterStyleDecls, GridOuterStyleProps> {
  constructor(values: GridOuterStyleDecls) {
    const types: StyleTypes = {
      width: Width,
      height: Height,
      spacing: Spacing,
      borderRadius: BorderRadius,
    };

    super(types, values);
  }
}

/* INNER */

export interface GridInnerStyleDecls extends StyleDecls {
  borderRadius?: BorderRadiusValues|string;
}

export interface GridInnerStyleProps extends StyleProps {
  borderRadius: BorderRadius;
}

export class GridInnerStyle extends Style<GridInnerStyleDecls, GridInnerStyleProps> {
  constructor(values: GridInnerStyleDecls) {
    const types: StyleTypes = {
      borderRadius: BorderRadius,
    };

    super(types, values);
  }
}