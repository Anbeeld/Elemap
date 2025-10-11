import { ArrayOfExtensions, Extensions, prepareExtensionsInput } from '../utils.js';
import { Content } from '../content.js';
import { demangleContentIds } from '../mangle.js';

export class ElemapContent {
  private _: Content;

  constructor(content: Content) {
    this._ = content;
  }

  public get ids() {
    return demangleContentIds(this._.ids);
  }
  
  public extend(extensions: Extensions|ArrayOfExtensions) {
    return this._.extend(prepareExtensionsInput(extensions));
  }
  
  public shrink(extensions: string[]) {
    return this._.shrink(extensions);
  }

  public get extensions(): Extensions {
    return this._.extensions;
  }
}