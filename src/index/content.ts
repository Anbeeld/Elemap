import { Extension } from '../utils.js';
import { Content } from '../content.js';
import { demangleProperty } from '../mangle.js';

export class ElemapContent {
  private _: Content;

  constructor(content: Content) {
    this._ = content;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__extend();
    this.demangle__report();
  }
  
  public extend(extension: Extension) : void {
    return this.method__extend(extension);
  }
  private demangle__extend() {
    demangleProperty(this, 'extend', (extension: Extension) => this.method__extend(extension));
  }
  private method__extend(extension: Extension) {
    return this._.extend(extension);
  }

  public report() {
    return this.method__report();
  }
  private demangle__report() {
    demangleProperty(this, 'report', () => this.method__report());
  }
  private method__report() {
    return this._.report();
  }
}