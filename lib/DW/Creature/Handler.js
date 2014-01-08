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

DW.CreatureHandler.prototype.initCreatures = function(sizeY) {
  for (var fY = 0; fY < sizeY; fY++) {
    this.creatures[fY] = [];
  }
}

DW.CreatureHandler.prototype.reset = function() {
  this.initCreatures(this.creatures.length);
}

DW.CreatureHandler.prototype.addCreature = function(type, fieldX, fieldY) {
  var creature = new DW.Creature(this.game, type, fieldX, fieldY);
  if (typeof this.creatures[fieldY][fieldX] == "undefined") this.creatures[fieldY][fieldX] = [];
  this.creatures[fieldY][fieldX].push(creature);
  creature.position.index = this.creatures[fieldY][fieldX].length-1;
}

DW.CreatureHandler.prototype.removeCreature = function(creature, keepSprite) {
  if (typeof this.creatures[creature.position.y][creature.position.x] != "undefined" &&
      this.creatures[creature.position.y][creature.position.x][creature.position.index] instanceof DW.Creature) {
    if (keepSprite !== true) this.game.display.creaturesContainer.removeChild(creature.sprite);
    this.creatures[creature.position.y][creature.position.x].splice(creature.position.index, 1);
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

DW.CreatureHandler.prototype.updatePosition = function(oldPosX, oldPosY, index, newPosX, newPosY) {
  if (typeof this.creatures[oldPosY][oldPosX] != "undefined" &&
      this.creatures[oldPosY][oldPosX][index] instanceof DW.Creature) {
    var creature = this.creatures[oldPosY][oldPosX][index];
    this.removeCreature(creature, true);
    if (typeof this.creatures[newPosY][newPosX] == "undefined") this.creatures[newPosY][newPosX] = [];
    creature.position.x = newPosX;
    creature.position.y = newPosY;
    this.creatures[newPosY][newPosX].push(creature);
  }
}

DW.CreatureHandler.prototype.update = function() {
  // determine target positions to move creatures
  for (var fY = 0; fY < this.creatures.length; fY++) {
    for (var fX = 0; fX < this.creatures[fY].length; fX++) {
      if (typeof this.creatures[fY][fX] != "undefined") {
        for (var i = 0; i < this.creatures[fY][fX].length; i++) {
          if (this.creatures[fY][fX][i] instanceof DW.Creature &&
              this.creatures[fY][fX][i].sprite !== null) {
            if (this.creatures[fY][fX][i].loadMovementTargetPosition() === true) {
              this.creatures[fY][fX][i].movement.path = this.game.map.calculatePath(
                this.creatures[fY][fX][i].position, this.creatures[fY][fX][i].movement.targetPosition
              );
              this.game.display.moveCreature(this.creatures[fY][fX][i]);
            }
          }
        }
      }
    }
  }
}