import { Extension } from '../utils.js';
import { Content } from '../content.js';
import { demangleProperty } from '../mangle.js';

export class ElemapContent {
  private _: Content;

  constructor(content: Content) {
    this._ = content;

    // For JavaScript - ensure methods are available by their original names
    this.demangle__extend();
    this.demangle__extensions();
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

  public set extensions(value: any) { value; }
  public get extensions() { return this.method__extensions(); }
  private demangle__extensions() {
    demangleProperty(this, 'extensions', {
      set: (value: any) => { value; },
      get: () => this.method__extensions()
    });
  }
  private method__extensions() {
    return this._.extensions;
  }
}