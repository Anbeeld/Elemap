import { Prop, PropValues } from './prop.js';

export interface PaddingValues extends PropValues {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

const defaults: PaddingValues = {
  top: '0',
  right: '0',
  bottom: '0',
  left: '0'
}

export class Padding extends Prop<PaddingValues> {
  protected override _name: string = 'padding';

  constructor(values: PaddingValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.top} ${this.right} ${this.bottom} ${this.left};`
  }
}