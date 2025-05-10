import { Register, StyleIds } from "../register.js";
// import { StyleDecls } from "./set.js";

export default abstract class Style {
  protected abstract _ids: StyleIds;
  protected abstract set ids(value: StyleIds);
  public abstract get ids();

  // public abstract get decls() : StyleDecls;

  public constructor() {}

  public get owner() : any { return Register.map.abstract(this.ids.owner)!; }

  public get selectors() {
    return {
      base: `.elemap-${this.ids.owner.map}`
    };
  }

  protected abstract get core() : string;
  protected abstract get schema() : string;
  protected abstract get generated() : string;
}