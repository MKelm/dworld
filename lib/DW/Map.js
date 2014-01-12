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

DW.Map = function(game) {

  this.game = game;
  this.fieldAmount = null;
  this.fieldSize = { width: 50, height: 50 };

  // a grid with not walkable fields
  this.grid = null;

  this.fieldTypes = [
    { handle: "grass", block: false }, // 0
    { handle: "dirt", block: false }, // 1
    { handle: "rock", block: true }, // 2
    { handle: "tree", block: true }, // 3
    { handle: "chest_grass", block: false }, // 4
    { handle: "chest_dirt", block: false }, // 5
    { handle: "cave", block: false } // 6
  ];

  this.lastMapHandle = null;
  this.loadedFields = null;
  this.transitions = [];

  this.viewDistance = 5;
}

DW.Map.prototype.constructor = DW.Map;

DW.Map.prototype.getMinMaxField = function(playerPosition) {
  var minPosition = {
    x: playerPosition.x - this.viewDistance,
    y: playerPosition.y - this.viewDistance
  };
  if (minPosition.x < 0) minPosition.x = 0;
  if (minPosition.y < 0) minPosition.y = 0;
  var maxPosition = {
    x: playerPosition.x + this.viewDistance,
    y: playerPosition.y + this.viewDistance
  };
  if (maxPosition.x > this.fieldAmount.x - 1) maxPosition.x = this.fieldAmount.x;
  if (maxPosition.y > this.fieldAmount.y - 1) maxPosition.y = this.fieldAmount.y;
  return { min: minPosition, max: maxPosition };
}

DW.Map.prototype.calculatePath = function (position, targetPosition) {

  var gridBackup = this.grid.clone();

  var finder = new PF.BestFirstFinder({
    allowDiagonal: true,
    dontCrossCorners: true
  });
  var path = finder.findPath(position.x, position.y, targetPosition.x, targetPosition.y, this.grid);
  path.splice(0, 1);

  this.grid = gridBackup;

  return path;
}

DW.Map.prototype.load = function(mapHandle) {
  this.loadedFields = [];
  this.game.creatureHandler.reset();

  var config = dw.util.loadJSON('./lib/data/map/'+mapHandle+'/config.json');

  this.fieldAmount = { x: 10 * config.size.width, y: 10 * config.size.height };
  this.grid = new PF.Grid(this.fieldAmount.x, this.fieldAmount.y)

  this.game.player.position.x = config.player.x;
  this.game.player.position.y = config.player.y;

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
          this.loadedFields[fieldY + fY].push({ type: area.fields[fY][fX], visible: false });

          this.grid.setWalkableAt(fieldX+fX, fieldY+fY, !this.fieldTypes[area.fields[fY][fX]].block);

          if (area.fields[fY][fX] == 4 || area.fields[fY][fX] == 5) {
            // load chests to chest handler
            this.game.chestHandler.addChest(fieldX + fX, fieldY + fY);
          }
        }
      }

      // set transition data to fields if available
      if (typeof area.transitions != "undefined") {
        for (var i = 0; i < area.transitions.length; i++) {
          var trans = area.transitions[i];
          this.loadedFields[fieldY + trans[2]][fieldX + trans[3]].transition = {
            handle: trans[0],
            title: trans[1],
            position: { x: fieldX + trans[3], y: fieldY + trans[2] }
          };
          if (trans[0] == this.lastMapHandle) {
            this.game.player.position = { x: fieldX + trans[3], y: fieldY + trans[2] };
          }
        }
      }

      // load creatures to creature handler
      if (typeof area.creatures != "undefined") {
        for (var i = 0; i < area.creatures.length; i++) {
          // set absolute field positions
          area.creatures[i][1] = fieldY + area.creatures[i][1]; // y
          area.creatures[i][2] = fieldX + area.creatures[i][2]; // x
          this.game.creatureHandler.addCreature(
            area.creatures[i][0], area.creatures[i][2], area.creatures[i][1]
          );
        }
      }
    }
  }

  this.lastMapHandle = mapHandle;
}

DW.Map.prototype.getTypeByPosition = function(fieldX, fieldY) {
  return this.loadedFields[fieldY][fieldX].type;
}

DW.Map.prototype.getTransitionByPosition = function(fieldX, fieldY) {
  return this.loadedFields[fieldY][fieldX].transition;
}