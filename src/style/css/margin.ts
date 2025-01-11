import { Prop, PropValues } from './prop.js';

export interface MarginValues extends PropValues {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

const defaults: MarginValues = {
  top: '0',
  right: '0',
  bottom: '0',
  left: '0'
}

export class Margin extends Prop<MarginValues> {
  protected override _name: string = 'margin';

  constructor(values: MarginValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.top} ${this.right} ${this.bottom} ${this.left};`
  }
}