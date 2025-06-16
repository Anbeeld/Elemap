const elemap = new Elemap(
  typeof type !== 'undefined' ? type : 'rectangle',
  typeof config !== 'undefined' ? config : {}
);

elemap.grid.tileByCoords(1, 1).updateStyle({outer: 'background-color: red;'});
elemap.grid.tileByCoords(1, 2).updateStyle({outer: 'background-color: green;'});
elemap.grid.tileByCoords(2, 2).updateStyle({outer: 'background-color: blue;'});

elemap.render(document.getElementById('elemap-container'));