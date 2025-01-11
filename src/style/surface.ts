import { BackgroundValues, Background } from "./css/background.js";
import { Style, StyleDecls, StyleProps, StyleTypes } from "./style.js";
import { PaddingValues, Padding } from "./css/padding.js";
import { BorderRadiusValues, BorderRadius } from "./css/border-radius.js";

/* OUTER */

export interface SurfaceOuterStyleDecls extends StyleDecls {
  background?: BackgroundValues;
  padding?: PaddingValues|string;
}

export interface SurfaceOuterStyleProps extends StyleProps {
  background: Background;
  padding: Padding;
}

export class SurfaceOuterStyle extends Style<SurfaceOuterStyleDecls, SurfaceOuterStyleProps> {
  constructor(values: SurfaceOuterStyleDecls) {
    const types: StyleTypes = {
      background: Background,
      padding: Padding,
    }
    super(types, values);
  }
}

/* INNER */

export interface SurfaceInnerStyleDecls extends StyleDecls {
  borderRadius?: BorderRadiusValues|string;
}

export interface SurfaceInnerStyleProps extends StyleProps {
  borderRadius: BorderRadius;
}

export class SurfaceInnerStyle extends Style<SurfaceInnerStyleDecls, SurfaceInnerStyleProps> {
  constructor(values: SurfaceInnerStyleDecls) {
    const types: StyleTypes = {
      borderRadius: BorderRadius,
    }
    super(types, values);
  }
}