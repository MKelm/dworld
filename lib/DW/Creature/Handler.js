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

DW.CreatureHandler = function(game) {

  this.game = game;
  this.creatures = [];
}

DW.CreatureHandler.prototype.constructor = DW.CreatureHandler;

DW.CreatureHandler.prototype.initActiveCreatures = function(sizeY) {
  for (var fY = 0; fY < sizeY; fY++) {
    this.creatures[fY] = [];
  }
}

DW.CreatureHandler.prototype.reset = function() {
  this.creatures = [];
}

DW.CreatureHandler.prototype.addCreature = function(type, fieldX, fieldY) {
  var creature = new DW.Creature(this.game, type, fieldX, fieldY);
  if (typeof this.creatures[fieldY][fieldX] == "undefined") this.creatures[fieldY][fieldX] = [];
  this.creatures[fieldY][fieldX].push(creature);
  creature.index = this.creatures[fieldY][fieldX].length-1;
}

DW.CreatureHandler.prototype.removeCreature = function(creature) {
  if (this.creatures[creature.position.y][creature.position.x][creature.index] instanceof DW.Creature) {
    this.game.display.creaturesContainer.removeChild(creature.gfx);
    this.creatures[creature.position.y][creature.position.x].splice(creature.index, 1);
    for (var i = 0; i < this.creatures[creature.position.y][creature.position.x].length; i++) {
      this.creatures[creature.position.y][creature.position.x][i].index = i;
    }
  }
}

DW.CreatureHandler.prototype.getCreaturesByPosition = function(fieldX, fieldY) {
  if (typeof this.creatures[fieldY][fieldX] == "object" &&
      this.creatures[fieldY][fieldX].length > 0) {
    return this.creatures[fieldY][fieldX];
  }
  return [];
}

DW.CreatureHandler.prototype.update = function() {
  // determine target positions to move creatures
  for (var i = 0; i < this.creatures.length; i++) {
    if (this.creatures[i] instanceof DW.Creature) {
      if (this.creatures[i].loadMovementTargetPosition() === true) {
        this.creatures[i].movement.path = this.game.map.calculatePath(
          this.creatures[i].position, this.creatures[i].movement.targetPosition
        );
        this.game.display.moveCreature(this.activeCreatures[i]);
      }
    }
  }
}