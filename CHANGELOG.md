## 0.1.3

- Replaced an overly complex and detailed styling system with a much simpler solution, which uses CSS declarations instead of single properties. While the latter provided full control over styling, with the ability to access and edit every property in TS code and whitelist which properties can be used, it turned out to be overly difficult in terms of development and user configuration, as every single CSS property needs to be added to its correspoding style, verified, supported in the config and so on. The new system is much simpler, as it works on the declaration level instead, so many things like verification can be outsourced to the CSS engine, and user config becomes much easier to digest.
- Fixed incorrect positioning of outer tiles for hexagon flat grids.
- Exported index class now doesn't expose the Map class itself, allowing to specifically define methods available to the users without interfering with public ones that are meant to be used inside the library only.
- Added setters where getters were already defined.
- Removed underscore prefixes from private property and method names, except for properties behind setters and getters.
- Renamed CSS element classes.
- Webpack minimizing config now affects all property names, except the ones starting with $ or accessed with bracket, which can be used as a form of shielding.
- Various small fixes and styling related adjustments.

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