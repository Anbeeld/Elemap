import { Prop, PropValues } from './prop.js';

export interface SizeValues extends PropValues {
  length?: string
};

const defaults: SizeValues = {
  length: '0px'
}

class Size extends Prop<SizeValues> {
  protected override _name: string = 'size';

  constructor(values: SizeValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.length};`
  }
}

export class Width extends Size {
  protected override _name: string = 'width';
}
export class Height extends Size {
  protected override _name: string = 'height';
}

export class Spacing extends Size {
  protected override _name: string = 'spacing';

  public override get css() {
    return ``;
  }
}

export class ContourWidth extends Size {
  protected override _name: string = 'spacing';

  public override get css() {
    return ``;
  }
}