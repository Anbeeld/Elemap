import { Prop, PropValues } from './prop.js';

export interface BackgroundValues extends PropValues {
  attachment?: string,
  clip?: string,
  color?: string,
  image?: string,
  origin?: string,
  position?: string,
  repeat?: string,
  size?: string
};

const defaults: BackgroundValues = {
  attachment: 'scroll',
  clip: 'border-box',
  color: 'transparent',
  image: 'none',
  origin: 'padding-box',
  position: '0% 0%',
  repeat: 'repeat',
  size: 'auto'
}

export class Background extends Prop<BackgroundValues> {
  protected override _name: string = 'background';

  constructor(values: BackgroundValues|string) {
    super(defaults, values);
  }

  public get css() {
    return `${this.name}: ${this.color} ${this.image} ${this.position} / ${this.size} ${this.repeat} ${this.attachment} ${this.origin} ${this.clip};`;
  }
}