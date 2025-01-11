import { roundFloat } from '../../utils.js';

export function checkValueValidity(prop: string, value: string) {
  switch (prop) {
    case 'background-attachment':
      if (value === 'fixed' || value === 'scroll' || value === 'local') {
        return true;
      }
      return false;
    case 'background-clip':
      if (value === 'border-box' || value === 'padding-box' || value === 'content-box' || value === 'text' || value === 'border-area') {
        return true;
      }
      return false;
    case 'background-origin':
      if (origin === 'border-box' || origin === 'padding-box' || origin === 'content-box') {
        return true;
      }
      return false;
    // case 'background-color':
    // case 'background-image':
    // case 'background-position':
    // case 'background-position-x':
    // case 'background-position-y':
    case 'background-repeat':
      if (value === 'repeat' || value === 'repeat-x' || value === 'repeat-y' || value === 'space' || value === 'round' || value === 'no-repeat') {
        return true;
      }
      return false;
    // case 'background-size':
    default:
      return true;
  }
}

export function cssValueToNumber(value: string) : number {
  if (value.endsWith('px')) {
    return Number(value.slice(0, -2));
  }
  return Number(value);
}

export function addCssLength(a: string, b: string) : string {
  if (a.endsWith('px') && b.endsWith('px')) {
    return `${Number(a.slice(0, -2)) + Number(b.slice(0, -2))}px`;
  }
  return `calc(${a} + ${b})`;
}

export function subtractCssLength(a: string, b: string) : string {
  if (a.endsWith('px') && b.endsWith('px')) {
    return `${Number(a.slice(0, -2)) - Number(b.slice(0, -2))}px`;
  }
  return `calc(${a} - ${b})`;
}

export function multiplyCssLength(a: string, b: number, rounding: number = 0) : string {
  if (a.endsWith('px')) {
    return `${roundFloat(Number(a.slice(0, -2)) * b, rounding)}px`;
  }
  return `calc(${a} * ${b})`;
}

export function divideCssLength(a: string, b: number) : string {
  if (a.endsWith('px')) {
    return `${Number(a.slice(0, -2)) / b}px`;
  }
  return `calc(${a} / ${b})`;
}