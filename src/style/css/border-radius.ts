import { Prop, PropValues } from './prop.js';

export interface BorderRadiusValues extends PropValues {
  radius?: string;
};

const defaults: BorderRadiusValues = {
  radius: '0',
}

export class BorderRadius extends Prop<BorderRadiusValues> {
  protected override _name: string = 'border-radius';

  constructor(values: BorderRadiusValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.radius};`
  }
}