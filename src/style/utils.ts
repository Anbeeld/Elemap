import { roundFloat, isNumeric } from '../utils.js';

export function cssValueToNumber(value: string) : number {
  if (value.endsWith('px')) {
    return Number(value.slice(0, -2));
  }
  return Number(value);
}

function calcValueToNumber(value: string|number) : number {
  if (typeof value === 'number') {
    return value;
  }
  if (isNumeric(value)) {
    return Number(value);
  }
  if (value.endsWith('px') && isNumeric(value.slice(0, -2))) {
    return Number(value.slice(0, -2));
  }
  throw new Error(`Invalid calc value: ${value}`);
}

function isNumberOrPx(value: string|number) : boolean {
  if (typeof value === 'number') {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }
  if (isNumeric(value)) {
    return true;
  }
  if (value.endsWith('px') && isNumeric(value.slice(0, -2))) {
    return true;
  }
  return false;
}

function isArrayOfNumbersAndPxs(values: (string|number)[]) : boolean {
  return values.every(isNumberOrPx);
}

const rounding = 4;

// Named after css calc()
export const calc = {
  add: (...values: (string|number)[]) : string => {
    if (values[0] === undefined || values.length === 0) {
      return '0px';
    }
    if (values[1] === undefined || values.length === 1) {
      return `${calcValueToNumber(values[0])}px`;
    }

    if (isArrayOfNumbersAndPxs(values)) {
      let sum = calcValueToNumber(values[0]);
      for (let i = 1; i < values.length; i++) {
        sum += calcValueToNumber(values[i]!);
      }
      return `${roundFloat(sum, rounding)}px`;
    }

    return `calc(${values.join(' + ')})`;
  },
  
  sub: function(...values: (string|number)[]) : string {
    if (values[0] === undefined || values.length === 0) {
      return '0px';
    }
    if (values[1] === undefined || values.length === 1) {
      return `${calcValueToNumber(values[0])}px`;
    }

    if (isArrayOfNumbersAndPxs(values)) {
      let sum = calcValueToNumber(values[0]);
      for (let i = 1; i < values.length; i++) {
        sum -= calcValueToNumber(values[i]!);
      }
      return `${roundFloat(sum, rounding)}px`;
    }
    
    return `calc(${values.join(' - ')})`;
  },
  
  mult: (...values: (string|number)[]) : string => {
    if (values[0] === undefined || values.length === 0) {
      return '0px';
    }
    if (values[1] === undefined || values.length === 1) {
      return `${calcValueToNumber(values[0])}px`;
    }

    if (isArrayOfNumbersAndPxs(values)) {
      let sum = calcValueToNumber(values[0]);
      for (let i = 1; i < values.length; i++) {
        sum *= calcValueToNumber(values[i]!);
      }
      return `${roundFloat(sum, rounding)}px`;
    }
    
    return `calc(${values.join(' * ')})`;
  },
  
  div: (...values: (string|number)[]) : string => {
    if (values[0] === undefined || values.length === 0) {
      return '0px';
    }
    if (values[1] === undefined || values.length === 1) {
      return `${calcValueToNumber(values[0])}px`;
    }

    if (isArrayOfNumbersAndPxs(values)) {
      let sum = calcValueToNumber(values[0]);
      for (let i = 1; i < values.length; i++) {
        sum /= calcValueToNumber(values[i]!);
      }
      return `${roundFloat(sum, rounding)}px`;
    }
    
    return `calc(${values.join(' / ')})`;
  },

  round: (value: string, precision: number) => {
    return `${roundFloat(calcValueToNumber(value), precision)}px`;
  }
}