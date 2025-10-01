import { Extensions } from '../utils.js';
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
  
  public extend(extension: Extensions) : void {
    return this.method__extend(extension);
  }
  private demangle__extend() {
    demangleProperty(this, 'extend', (extension: Extensions) => this.method__extend(extension));
  }
  private method__extend(extension: Extensions) {
    return this._.extend(extension);
  }

  public set extensions(value: Extensions) { value; }
  public get extensions() { return this.method__extensions(); }
  private demangle__extensions() {
    demangleProperty(this, 'extensions', {
      set: (value: Extensions) => { value; },
      get: () => this.method__extensions()
    });
  }
  private method__extensions() {
    return this._.extensions;
  }
}