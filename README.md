![Elemap cover image](https://anbeeld.com/images/elemap-cover.jpg)

[![NPM](https://img.shields.io/npm/v/elemap?label=NPM)](https://www.npmjs.com/package/elemap)

# Elemap

Elemap is a no-dependency TS library for creating interactive game maps, rendered using HTML elements and CSS. This way you can easily populate them by adding your own HTML and manipulate everything hassle-free with JS/TS.

Live demo is available [on my website](https://anbeeld.com/elemap).

It goes well with my other library, [Tilted](https://github.com/anbeeld/Tilted), made for displaying content like game maps in a modern 2.5D way.

[![Support my work!](https://anbeeld.com/images/support.jpg)](https://anbeeld.com/support)

## Features

- Multiple types of maps tiles supported, including rectangle (square/irregular) and hexagon (pointy/flat, odd/even) at the moment.
- HTML & CSS rendering, meaning you can easily alter, modify and extend the map, with simple JS being enough to add any required interaction.
- Tile shapes are set using clip-path to ensure correct mouse behaviour.
- Spacing between tiles, outline on hover, rounded corners, and more included by default.
- Styling system based around CSS with the ability to set custom visuals for each tile.

## Installation

`npm i elemap` or grab [JS dist file](https://github.com/Anbeeld/Elemap/tree/main/dist) from GitHub repo.

## Usage

`import Elemap from 'elemap'` if using npm

`const elemap = new Elemap(config?, style?)`

`elemap.render(container)`

`config` is an object that sets up type of the map and grid parameters. Please refer to `examples` for more info.

`style` is an object with arguments for map visuals, used by internal system based around CSS. Please refer to `examples` and `defaultSurfaceStyleDeclsGroup` in `src/style/set.ts` for more info. Note that its signature is `{surface:{}, grid:{}, tile:{}}`, which differs from the signature used on the inside.

`container` is an element that will store Elemap contents.

More sophisticated documentation will be provided in the future.

## Future plans

- Allow for maps of arbitrary forms by disabling unneeded tiles.
- Provide methods to place HTML elements on tiles, move them between tiles and so on.
- Implement granular re-rendering of a certain tile(s) and a mechanism to refresh map if some elements were removed from DOM.
- Add methods for distance and pathfinding calculations.
- Add plain map (without tile grid) and more tile types.
- Provide clear usage documentation.
- Improve styling system for better validation of provided config and more options to alter map visuals.
- Ensure best possible performance.
- Improve overall code quality.
- ...more to come

[![Support my work!](https://anbeeld.com/images/support.jpg)](https://anbeeld.com/support)