import { Prop, PropValues } from './css/prop.js';

export interface StyleTypes {
  [key: string]: typeof Prop<PropValues>
}
export interface StyleProps {
  [key: string]: Prop<PropValues>
}
export interface StyleDecls {
  [key: string]: PropValues|string|undefined;
  custom?: string;
}

export abstract class Style<D extends StyleDecls, P extends StyleProps> {
  [key: string]: any;

  protected types: StyleTypes;

  constructor(types: StyleTypes, values: D) {
    this.types = types;

    for (const key of Object.keys(this.types)) {
      let propValues: PropValues|string;
      if (values[key]) {
        propValues = values[key];
      } else {
        propValues = {};
      }
      this.setProp(key, propValues);
    }
  }

  public setProp(key: keyof P, values: PropValues|string) : void {
    if (!this.types.hasOwnProperty(key as any)) return;
    this[key as string] = this.newProp(this.types[key as any] as any, values);
  }
  public setProps(decls: StyleDecls) : void {
    for (const [key, values] of Object.entries(decls)) {
      this.setProp(key, values!);
    }
  }

  private newProp<T extends Prop<Vs>, Vs extends PropValues>(prop: new (values: Vs|string) => T, values: Vs|string) : T {
    return new prop(values);
  }

  public get css() : string {
    let css = '';
    for (const [key, val] of Object.entries(this)) {
      if (val instanceof Prop) {
        key; // TODO
        css += `${val.css}`;
      } else if (key === 'custom') {
        css += `${val}`;
      }
    }
    return css;
  }

  public get decls() : StyleDecls {
    let decls: StyleDecls = {};
    for (const [key, val] of Object.entries(this)) {
      if (val instanceof Prop) {
        decls[key] = val;
      } else if (key === 'custom') {
        decls.custom = val;
      }
    }
    return decls;
  }
}