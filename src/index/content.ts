import { ArrayOfExtensions, Extensions, prepareExtensionsInput } from '../utils.js';
import { Content } from '../content.js';

export class ElemapContent {
  private _: Content;

  constructor(content: Content) {
    this._ = content;
  }
  
  public extend(extensions: Extensions|ArrayOfExtensions) {
    return this._.extend(prepareExtensionsInput(extensions));
  }
  
  public shrink(paths: string[]) {
    return this._.shrink(paths);
  }

  public get extensions(): Extensions {
    return this._.extensions;
  }
}