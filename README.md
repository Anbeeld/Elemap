![Elemap cover image](https://anbeeld.com/images/elemap-cover.jpg)

[![NPM](https://img.shields.io/npm/v/elemap?label=NPM)](https://www.npmjs.com/package/elemap)

# Elemap

Elemap is a zero-dependency TS library for creating interactive game maps, rendered using HTML elements and CSS. This way you can easily populate them by adding your own HTML and manipulate everything hassle-free with JS/TS.

Live demo is available [on my website](https://anbeeld.com/elemap).

It goes well with my other library, [Tilted](https://github.com/anbeeld/Tilted), made for displaying content like game maps in a modern 2.5D way.

[![Support my work!](https://anbeeld.com/images/support.jpg)](https://anbeeld.com/support)

## Features

- Multiple types of maps tiles supported: rectangle (square/irregular) and hexagon (pointy/flat, odd/even).
- Support of arbitrary map shapes, as tiles are not required to be put sequentually and can be hidden.
- Various methods to work with the grid, like creating new tiles, getting tile neighbors, and so on.
- HTML & CSS rendering, meaning you can easily modify the map and extend its functionality with JS.
- Spacing between tiles, outline on hover, rounded corners, and more included by default.
- Styling system based around CSS with the ability to set custom visuals for each tile.
- Tile shapes are set using clip-path to ensure correct mouse behaviour.
- Content system, allowing to set external HTML elements as related to the map or even a specific tile.
- Extension system to store arbitrary data related to the map right in its object.
- Export and import functionality, allowing you to retrieve the map data and recreate it if needed.

## Installation

`npm i elemap` or grab [JS dist file](https://github.com/Anbeeld/Elemap/tree/main/dist) from GitHub repo.

## Usage

`import Elemap from 'elemap'` if using npm

`const elemap = new Elemap(type?, config?)`

`config` is an object that sets up type of the map and grid parameters. Please refer to `examples` for more info.

`config` includes `schema`, which is an object with arguments for map visuals, used by styling system based around CSS declarations. Please refer to `examples` and `src/style/schema.ts` for more info.

`elemap.render(container)` to draw the map on the page, where `container` is an element that will store Elemap contents.

More sophisticated documentation will be provided in the future.

## Future plans

- Fix severely lacking error handling and validation of user input.
- Add a rich set of methods to work with tiles and content, like moving it between tiles and so on.
- Implement more granular re-rendering of map HTML elements.
- Add tile calculations such as pathfinding, range, rotation, etc.
- Add plain map (without tile grid) and more tile types, including arbitrary shapes.
- Provide clear usage documentation.
- Ensure best possible performance.
- Improve overall code quality.
- ...more to come

[![Support my work!](https://anbeeld.com/images/support.jpg)](https://anbeeld.com/support)