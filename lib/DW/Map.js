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

  this.loadedFields = null;

  this.load("greenland");
}

DW.Map.prototype.constructor = DW.Map;

DW.Map.prototype.load = function(mapHandle) {
  this.loadedFields = [];

  var config = dw.util.loadJSON('./lib/data/map/'+mapHandle+'/config.json');

  var startAreaX = 0, startAreaY = 0;
  var endAreaX = startAreaX + (config.size.width - 1),
      endAreaY = startAreaY + (config.size.height - 1);

  var fieldY = 0, fieldX = 0;

  for (var areaY = startAreaY; areaY <= endAreaY; areaY++) {
    fieldY = areaY * 10;
    for (var areaX = startAreaX; areaX <= endAreaX; areaX++) {
      fieldX = areaX * 10;

      var area = dw.util.loadJSON('./lib/data/map/'+mapHandle+'/area_y'+areaY+'_x'+areaX+'.json');

      for (var fY = 0; fY < area.fields.length; fY++) {
        if (typeof this.loadedFields[fieldY + fY] == "undefined") this.loadedFields[fieldY + fY] = [];

        for (var fX = 0; fX < area.fields[fY].length; fX++) {
          this.loadedFields[fieldY + fY].push(area.fields[fY][fX]);
        }
      }
    }
  }
}