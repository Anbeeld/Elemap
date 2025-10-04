import { Extensions } from '../utils.js';
import { Content } from '../content.js';

export class ElemapContent {
  private _: Content;

  constructor(content: Content) {
    this._ = content;
  }
  
  public extend(extension: Extensions) {
    return this._.extend(extension);
  }

  public get extensions(): Extensions {
    return this._.extensions;
  }
}