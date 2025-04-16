## 0.1.2

- Reduced default values for width and height (as in the amount of tiles) of a grid.
- Fixed grid width and height being mixed up in a few places in the code.

## 0.1.1

- Merged functionality of :before CSS pseudo-elements of inner tiles into their main elements, removing unnecessary HTML elements.
- An outer tile now renders as separate element only if its style differs from the grid standard one, removing unnecessary HTML elements.
- Size of a tile is now controlled by the spacing style parameter of the outer grid and width/height style parameters of the inner grid.
- Tile contours are now rendered on their own layer with one same HTML element being CSS transform'ed to visually move on the map, replacing :after CSS pseudo-elements that were used for this previously.
- Grid objects now allow you to get a tile object by its element.
- Changed class naming from "elemap-element-ID" to "elemap-ID-element".
- Removed Raoi dependency, replacing it with a simpler object register baked into the lib itself.
- Updated naming to non-public being underscored.
- Updated Webpack minimizing config, resulting in a smaller dist file.

## 0.1.0

- Initial release.