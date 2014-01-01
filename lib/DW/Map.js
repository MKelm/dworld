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
  /* field types:
   * 0 = grass
   * 1 = dirt
   * 2 = rock
   * 3 = tree
   */
  this.loadedAreas = [];

  this.playerPosition = { x: 2, y: 2 };
  this.loadMapAreas(0, 0);

  // load map and so on
}

DW.Map.prototype.constructor = DW.Map;

DW.Map.prototype.loadMapAreas = function(currentAreaX, currentAreaY) {
  // todo: load more than one area
  var area = dw.util.loadJSON('./lib/data/map/area_y'+currentAreaY+'_x'+currentAreaX+'.json');

  if (typeof this.loadedAreas[currentAreaY] == "undefined") this.loadedAreas[currentAreaY] = [];
  this.loadedAreas[currentAreaY][currentAreaX] = area;
  this.loadedAreas[currentAreaY][currentAreaX].visible = false;
}