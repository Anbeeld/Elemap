import { cssValueToNumber } from './style/utils.js';

export type Size = {
  width: number,
  height: number
};

export type Position = {
  top: string,
  right?: string,
  bottom?: string,
  left: string
}

export enum MapType {
  Rectangle = 'rectangle',
  Hexagon = 'hexagon'
}

export enum GridOrientation {
  Pointy = 'pointy',
  Flat = 'flat'
}

export enum GridOffset {
  Odd = 'odd',
  Even = 'even',
}

export interface Coords {
  [key: string]: number
}

export interface AxialCoords extends Coords {
  r: number;
  q: number;
}

export interface CartesianCoords extends Coords {
  x: number;
  y: number;
}

export function isAxialCoords(coords: Coords) : boolean {
  return coords.q !== undefined && coords.r !== undefined;
}

export function isCartesianCoords(coords: Coords) : boolean {
  return coords.x !== undefined && coords.y !== undefined;
}

export function getCoordsRow<C extends Coords>(coords: C) : number {
  if (coords.q !== undefined && coords.r !== undefined) {
    return coords.q;
  }
  return coords.y!;
}
export function getCoordsCol<C extends Coords>(coords: C) : number {
  if (coords.q !== undefined && coords.r !== undefined) {
    return coords.r;
  }
  return coords.x!;
}

export function roundFloat(value: number, precision: number) : number {
  return parseFloat(value.toFixed(precision));
}

export const hexagonLongSize = 2;
export const hexagonShortSize = Math.sqrt(3);
export const hexagonSizeRatio = hexagonLongSize / hexagonShortSize;

// Based on https://codepen.io/shreyansqt/pen/qBjprWE
export function generateHexagonPath(type: GridOrientation, hexagonSize: hexagonSize, borderRadius: number = 0, margin = {top: 0, left: 0}) : string {
  // #################### x1,y0 ####################
  // ############## xc1,yc0 # xc2,yc0 ##############
  // ###############################################
  // ###############################################
  // #### xc0,yc1 ##################### xc3,yc1 ####
  // ## x0,y1 ############################# x2,y1 ##
  // ## x0,yc2 ########################### x2,yc2 ##
  // ###############################################
  // ###############################################
  // ## x0,yc3 ########################### x2,yc3 ##
  // ## x0,y2 ############################# x2,y2 ##
  // #### xc0,yc4 ##################### xc3,yc4 ####
  // ###############################################
  // ###############################################
  // ############## xc1,yc5 # xc2,yc5 ##############
  // #################### x1,y3 ####################

  const sin = (deg: number) => Math.sin((deg * Math.PI) / 180);
  const cos = (deg: number) => Math.cos((deg * Math.PI) / 180);
  const sin30 = sin(30);
  const cos30 = cos(30);

  const hexagonSide: number = cssValueToNumber(hexagonSize.side);
  const hexagonShort: number = cssValueToNumber(hexagonSize.short);
  const hexagonLong: number = cssValueToNumber(hexagonSize.long);

  const expectedShortSize = hexagonSide * cos30 * 2;
  const expectedLongSize = hexagonSide * 2;

  const xCorrection = hexagonShort / expectedShortSize;
  const yCorrection = hexagonLong / expectedLongSize;

  const rounding = 2;

  let x0 = 0;
  let y0 = 0;

  let x1 = roundFloat(hexagonSide * cos30 * xCorrection, rounding);
  let y1 = roundFloat(hexagonSide * sin30 * yCorrection, rounding);

  let xc1 = roundFloat(x1 - borderRadius * cos30 * xCorrection, rounding);
  let yc0 = roundFloat(borderRadius * sin30 * yCorrection, rounding);
  let xc2 = roundFloat(x1 + borderRadius * cos30 * xCorrection, rounding);

  let x2 = roundFloat(2 * x1, rounding);
  let y2 = roundFloat(y1 + hexagonSide, rounding);

  let xc3 = roundFloat(x2 - borderRadius * cos30 * xCorrection, rounding);
  let yc1 = roundFloat(y1 - borderRadius * sin30 * yCorrection, rounding);
  let yc2 = roundFloat(y1 + borderRadius * yCorrection, rounding);

  let y3 = roundFloat(y2 + y1, rounding);

  let yc3 = roundFloat(y2 - borderRadius * yCorrection, rounding);
  let yc4 = roundFloat(y2 + borderRadius * sin30 * yCorrection, rounding);

  let yc5 = roundFloat(y3 - borderRadius * sin30 * yCorrection, rounding);
  let xc0 = roundFloat(borderRadius * cos30 * xCorrection, rounding);

  if (type === GridOrientation.Pointy) {

    x0 = roundFloat(x0 + margin.left, rounding);
    x1 = roundFloat(x1 + margin.left, rounding);
    xc1 = roundFloat(xc1 + margin.left, rounding);
    xc2 = roundFloat(xc2 + margin.left, rounding);
    x2 = roundFloat(x2 + margin.left, rounding);
    xc3 = roundFloat(xc3 + margin.left, rounding);
    xc0 = roundFloat(xc0 + margin.left, rounding);
  
    y0 = roundFloat(y0 + margin.top, rounding);
    y1 = roundFloat(y1 + margin.top, rounding);
    yc0 = roundFloat(yc0 + margin.top, rounding);
    yc1 = roundFloat(yc1 + margin.top, rounding);
    yc2 = roundFloat(yc2 + margin.top, rounding);
    y2 = roundFloat(y2 + margin.top, rounding);
    yc3 = roundFloat(yc3 + margin.top, rounding);
    yc4 = roundFloat(yc4 + margin.top, rounding);
    y3 = roundFloat(y3 + margin.top, rounding);
    yc5 = roundFloat(yc5 + margin.top, rounding);

    return `` +
    `M ${xc1},${yc0}` +
    `Q ${x1},${y0} ${xc2},${yc0} ` +

    `L ${xc3},${yc1}` +
    `Q ${x2},${y1} ${x2},${yc2} ` +

    `L ${x2},${yc3}` +
    `Q ${x2},${y2} ${xc3},${yc4} ` +

    `L ${xc2},${yc5}` +
    `Q ${x1},${y3} ${xc1},${yc5} ` +

    `L ${xc0},${yc4}` +
    `Q ${x0},${y2} ${x0},${yc3} ` +
    
    `L ${x0},${yc2}` +
    `Q ${x0},${y1} ${xc0},${yc1} ` +
    `Z`;
  } else if (type === GridOrientation.Flat) {

    x0 = roundFloat(x0 + margin.top, rounding);
    x1 = roundFloat(x1 + margin.top, rounding);
    xc1 = roundFloat(xc1 + margin.top, rounding);
    xc2 = roundFloat(xc2 + margin.top, rounding);
    x2 = roundFloat(x2 + margin.top, rounding);
    xc3 = roundFloat(xc3 + margin.top, rounding);
    xc0 = roundFloat(xc0 + margin.top, rounding);
  
    y0 = roundFloat(y0 + margin.left, rounding);
    y1 = roundFloat(y1 + margin.left, rounding);
    yc0 = roundFloat(yc0 + margin.left, rounding);
    yc1 = roundFloat(yc1 + margin.left, rounding);
    yc2 = roundFloat(yc2 + margin.left, rounding);
    y2 = roundFloat(y2 + margin.left, rounding);
    yc3 = roundFloat(yc3 + margin.left, rounding);
    yc4 = roundFloat(yc4 + margin.left, rounding);
    y3 = roundFloat(y3 + margin.left, rounding);
    yc5 = roundFloat(yc5 + margin.left, rounding);

    return `` +
    `M ${yc0},${xc1}` +
    `Q ${y0},${x1} ${yc0},${xc2} ` +

    `L ${yc1},${xc3}` +
    `Q ${y1},${x2} ${yc2},${x2} ` +

    `L ${yc3},${x2}` +
    `Q ${y2},${x2} ${yc4},${xc3} ` +

    `L ${yc5},${xc2}` +
    `Q ${y3},${x1} ${yc5},${xc1} ` +

    `L ${yc4},${xc0}` +
    `Q ${y2},${x0} ${yc3},${x0} ` +

    `L ${yc2},${x0}` +
    `Q ${y1},${x0} ${yc1},${xc0} ` +
    `Z`;
  } else {
    throw new Error('Invalid hexagon type');
  }
}

export function generateRectanglePath(rectangleSize: TileSize, borderRadius: number = 0, margin = {top: 0, left: 0}) : string {
  // x0, y0 - xc0, y0 -------------- xc1, y0 - x1, y0
  // x0, yc0 -------------------------------- x1, yc0
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // ------------------------------------------------
  // x0, yc1 -------------------------------- x1, yc1
  // x0, y1 - xc0, y1 -------------- xc1, y1 - x1, y1

  const rectangleWidth: number = cssValueToNumber(rectangleSize.width);
  const rectangleHeight: number = cssValueToNumber(rectangleSize.height);

  const rounding = 2;

  let x0 = 0;
  let y0 = 0;

  let xc0 = x0 + borderRadius;
  let yc0 = y0 + borderRadius;

  let x1 = rectangleWidth;
  let xc1 = x1 - borderRadius;

  let y1 = rectangleHeight;
  let yc1 = y1 - borderRadius;
  
  x0 = roundFloat(x0 + margin.left, rounding);
  x1 = roundFloat(x1 + margin.left, rounding);
  xc1 = roundFloat(xc1 + margin.left, rounding);
  xc0 = roundFloat(xc0 + margin.left, rounding);

  y0 = roundFloat(y0 + margin.top, rounding);
  y1 = roundFloat(y1 + margin.top, rounding);
  yc0 = roundFloat(yc0 + margin.top, rounding);
  yc1 = roundFloat(yc1 + margin.top, rounding);

  return `` +
  `M ${x0},${yc0}` +
  `A ${borderRadius},${borderRadius} 0 0 1 ${xc0},${y0} ` +

  `L ${xc1},${y0}` +
  `A ${borderRadius},${borderRadius} 0 0 1 ${x1},${yc0} ` +

  `L ${x1},${yc1}` +
  `A ${borderRadius},${borderRadius} 0 0 1 ${xc1},${y1} ` +

  `L ${xc0},${y1}` +
  `A ${borderRadius},${borderRadius} 0 0 1 ${x0},${yc1} ` +
  `Z`;
}

export type TileSize = {
  width: string,
  height: string
}

export type TileSizeSet = {
  spaced: TileSize,
  outer: TileSize,
  inner: TileSize
}

export type hexagonSize = {
  side: string,
  long: string,
  short: string
}

export type hexagonSizeDecls = {
  spaced: hexagonSize,
  outer: hexagonSize,
  inner: hexagonSize
}

export function cartesianCoordsToAxial(cartesian: CartesianCoords, orientation: GridOrientation, offset: GridOffset) : AxialCoords {
  let axial: AxialCoords = {r: 0, q: 0};
  if (orientation === GridOrientation.Pointy) {
    axial.r = cartesian.y;
    if (offset === GridOffset.Odd) {
      axial.q = cartesian.x - (cartesian.y - (cartesian.y & 1)) / 2;
    } else {
      axial.q = cartesian.x - (cartesian.y + (cartesian.y & 1)) / 2;
    }
  } else {
    axial.q = cartesian.x;
    if (offset === GridOffset.Odd) {
      axial.r = cartesian.y - (cartesian.x - (cartesian.x & 1)) / 2;
    } else {
      axial.r = cartesian.y - (cartesian.x + (cartesian.x & 1)) / 2;
    }
  }
  return axial;
}

export function axialCoordsToCartesian(axial: AxialCoords, orientation: GridOrientation, offset: GridOffset) : CartesianCoords {
  let cartesian: CartesianCoords = {x: 0, y: 0};
  if (orientation === GridOrientation.Pointy) {
    cartesian.y = axial.r;
    if (offset === GridOffset.Odd) {
      cartesian.x = axial.q + (axial.r - (axial.r & 1)) / 2;
    } else {
      cartesian.x = axial.q + (axial.r + (axial.r & 1)) / 2;
    }
  } else {
    cartesian.x = axial.q;
    if (offset === GridOffset.Odd) {
      cartesian.y = axial.r + (axial.q - (axial.q & 1)) / 2;
    } else {
      cartesian.y = axial.r + (axial.q + (axial.q & 1)) / 2;
    }
  }
  return cartesian;
}

function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Based on https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      // Only if the key exists in the target object
      // if (!target.hasOwnProperty(key)) { 
      //   continue;
      // }
      if (isObject(target[key]) && isObject(source[key])) {
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type Extensions = Record<string, any>;
export type Extendable = { extensions: Extensions };
export type ArrayOfExtensions = [string, any][];

export class SignedArray<V> {
  [key: number]: V

  *[Symbol.iterator]() {
    for (const key of this.keys) {
      yield [key, this[key]] as [number, V];
    }
  }

  public get keys(): number[] {
    let keys: number[] = [];
    for (const key of Object.keys(this)) {
      let index: number;

      if (typeof key === 'string') {
        if (isNumeric(key)) {
          index = Number(key);
        } else {
          continue;
        }
      } else if (typeof key === 'number') {
        index = key;
      } else {
        continue;
      }

      keys.push(index);
    }
    
    keys.sort((a, b) => a - b);

    return keys;
  }

  public get values() : V[] {
    let values: V[] = [];
    for (const key of this.keys) {
      values.push(this[key]!);
    }
    return values;
  }

  public get length() : number {
    return this.keys.length;
  }
}

export class SignedTable<V> extends SignedArray<SignedArray<V>> {}

export function signedArrayfromObject<V>(object: any) {
  let signedArray = new SignedArray<V>();
  if (isObject(object)) {
    for (const key in object) {
      signedArray[Number(key)] = object[key];
    }
  }
  return signedArray;
}

export function signedTablefromObject<V>(object: any): SignedTable<V> {
  let signedTable = new SignedTable<V>();
  if (isObject(object)) {
    for (const key in object) {
      signedTable[Number(key)] = signedArrayfromObject(object[key]);
    }
  }
  return signedTable;
}

export function isNumeric(str: string) {
  if (typeof str !== "string") {
    return false;
  }
  return !isNaN(Number(str));
}

export function prepareExtensionsInput(extensions: Extensions|ArrayOfExtensions) {
  if (extensions.constructor === Array) {
    let arrayOfExtensions = extensions;
    extensions = {};
    for (let [path, value] of arrayOfExtensions) {
      let props = path.split('.');
      let current = extensions;
      for (let prop of props.slice(0, props.length - 1)) {
        if (!current[prop]) {
          current[prop] = {};
        }
        current = current[prop];
      }
      current[props[props.length - 1]!] = value;
    }
  }
  return extensions;
}