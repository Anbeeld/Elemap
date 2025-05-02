import { checkValueValidity } from './utils.js';

export interface PropValues {
  [key: string]: string|undefined
}

export abstract class Prop<V extends PropValues> {
  [key: string]: string|undefined
  protected abstract _name: string;
  protected set name(value: string) { this._name = value; }
  public get name() : string { return this._name; }

  constructor(defaults: V, values: V|string) {
    if (typeof values === 'string') {
      let value = values;
      values = {} as V;
      for (const key of Object.keys(defaults)) {
        values[key as keyof V] = value as V[keyof V];
      }
    }
    for (const [key, defaultValue] of Object.entries(defaults)) {
      let validated;
      if (!values.hasOwnProperty(key)) {
        validated = defaultValue;
      } else {
        // TODO make it prop-value pair
        if (!checkValueValidity(key as string, values[key] as string)) {
          throw new Error('Invalid ' + key + ' value: ' + values[key]);
        }
        validated = values[key]!; // Reason for ! is that we checked if it exists with hasOwnProperty
      }
      this[key] = validated;
    }
  }

  public abstract get css() : string;
}