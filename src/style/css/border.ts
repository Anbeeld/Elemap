import { Prop, PropValues } from './prop.js';

export interface BorderValues extends PropValues {
  width?: string,
  style?: string,
  color?: string
};

const defaults: BorderValues = {
  width: 'medium',
  style: 'none',
  color: 'currentcolor'
}

export class Border extends Prop<BorderValues> {
  protected override _name: string = 'border';

  constructor(values: BorderValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.width} ${this.style} ${this.color};`
  }
}