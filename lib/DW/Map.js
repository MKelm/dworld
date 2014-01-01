/*
 * This file is part of DWorld.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/dworld
 *
 * DWorld is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * DWorld is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with DWorld. If not, see <http://www.gnu.org/licenses/>.
 */

DW.Map = function() {

  this.fieldSize = { width: 50, height: 50 };

  this.fieldTypes = [
    { handle: "grass", block: false },
    { handle: "dirt", block: false },
    { handle: "rock", block: true },
    { handle: "tree", block: true },
    { handle: "chest", block: false }
  ];

  this.loadedAreas = [];

  this.maxAreas = { width: 3, height: 3 };
  this.loadAreas(0, 0);

  // load map and so on
}

DW.Map.prototype.constructor = DW.Map;

DW.Map.prototype.loadAreas = function(currentAreaX, currentAreaY) {

  var startAreaX = (currentAreaX > 0) ? currentAreaX - Math.floor(this.maxAreas.width/2) : currentAreaX;
  var startAreaY = (currentAreaY > 0) ? currentAreaY - Math.floor(this.maxAreas.height/2) : currentAreaY;

  var endAreaX = startAreaX + (this.maxAreas.width - 1);
  var endAreaY = startAreaY + (this.maxAreas.height - 1);

  for (var areaY = startAreaY; areaY <= endAreaY; areaY++) {
    for (var areaX = startAreaX; areaX <= endAreaX; areaX++) {
      if (typeof this.loadedAreas[areaY] == "undefined") this.loadedAreas[areaY] = [];

      var area = dw.util.loadJSON('./lib/data/map/area_y'+areaY+'_x'+areaX+'.json');

      this.loadedAreas[areaY][areaX] = area;
      this.loadedAreas[areaY][areaX].visible = false;
      this.loadedAreas[areaY][areaX].gfx = null; // use a display container for area
    }
  }
}