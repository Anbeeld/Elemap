## 0.2.0

- Implemented import and export methods for map, grid and tile classes. You can use the export method of a map object to return its snapshot containing all the data of the map itself, as well as its grid and tiles associated with it. You can then import it via a static method of the main index class, which will create an identical map. Import and export preserve the ids and thus are not meant for cloning, but rather for saving the state between sessions and alike. You can also use export on the grid object, which will result in a snapshot with the grid and tiles data, and also on the individual tiles. Importing is limited to the map at the moment, creating all the objects at once.
- Implemented mutate and report methods for map, grid and tile classes. The mutate method allows you to pass an object with arbitrary properties, which will be then saved as mutables in the Elemap entity you are passing it into. You can then use report method to get an object with all properties added in previous mutations. Alternatively, export snapshots include mutables as well. Mutation allows you to store any data and easily transfer it using Elemap objects instead of having multiple duplicate systems.
- User config now follows the structure of the map snapshot. Map type is no longer included in it, and is now a separate argument in the main index class. On the other hand, schema is now included in the config, while previously it was provided separately. Size, as in rows and columns of tiles, is now part of the grid properties instead of the main config object.
- Map, grid and tile classes are now constructed using their own sets of arguments, with defined properties mostly following their respective snapshots, instead of passing the initial user config.
- Added the grid index class, and made all the index classes generic based on map type, improving TypeScript compatibility.
- Improved generic types of abstract map, grid and tile classes.
- One more naming change for property mangling workarounds. Now it's just mangleX to convert input data into mangled names, and demangleX to convert mangled names into output data, all in a separate file. Hopefully that's the last one.
- Various small fixes and changes.

## 0.1.6

- Shielding from property mangling is now applied by using getProperty and setProperty utility functions.

## 0.1.5

- Improved naming of user arguments and their types for clarity.
- Moved everything related to HTML elements into rendering methods, allowing to create instances of Elemap in enviroments without DOM such as Node.
- Removed shielding from property mangling by starting its name with $, instead only bracket access method is used now.

## 0.1.4

- Improved internal handling of CSS declarations.
- Fixed some issues with build configuration.

## 0.1.3

- Replaced an overly complex and detailed styling system with a much simpler solution, which uses CSS declarations instead of single properties. While the latter provided full control over styling, with the ability to access and edit every property in TS code and whitelist which properties can be used, it turned out to be overly difficult in terms of development and user configuration, as every single CSS property needs to be added to its correspoding style, verified, supported in the config and so on. The new system is much simpler, as it works on the declaration level instead, so many things like verification can be outsourced to the CSS engine, and user config becomes much easier to digest.
- Fixed incorrect positioning of outer tiles for hexagon flat grids.
- Exported index class now doesn't expose the Map class itself, allowing to specifically define methods available to the users without interfering with public ones that are meant to be used inside the library only.
- Added setters where getters were already defined.
- Removed underscore prefixes from private property and method names, except for properties behind setters and getters.
- Renamed CSS element classes.
- Webpack minimizing config now affects all property names, except the ones starting with $ or accessed with brackets, which can be used as a form of shielding.
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