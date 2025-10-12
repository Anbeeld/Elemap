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
  
  public addExtensions(extensions: Extensions|ArrayOfExtensions) {
    return this._.addExtensions(prepareExtensionsInput(extensions));
  }
  
  public deleteExtensions(extensions: string[]) {
    return this._.deleteExtensions(extensions);
  }

  public get extensions(): Extensions {
    return this._.extensions;
  }
}