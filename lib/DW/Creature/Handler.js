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
  this.activeCreatures = [];
}

DW.CreatureHandler.prototype.constructor = DW.CreatureHandler;

DW.CreatureHandler.prototype.reset = function() {
  this.activeCreatures = [];
}

DW.CreatureHandler.prototype.addCreature = function(type, fieldX, fieldY) {
  var creature = new DW.Creature(type, fieldX, fieldY);
  this.activeCreatures.push(creature);
  creature.id = this.activeCreatures.length - 1;
}

DW.CreatureHandler.prototype.removeCreature = function(creature) {
  if (this.activeCreatures[creature.id] instanceof DW.Creature) {
    this.game.display.creaturesContainer.removeChild(creature.gfx);
    this.activeCreatures[creature.id] = null;
  }
}

DW.CreatureHandler.prototype.getCreatureByPosition = function(fieldX, fieldY) {
  for (var i = 0; i < this.activeCreatures.length; i++) {
    if (this.activeCreatures[i] instanceof DW.Creature &&
        this.activeCreatures[i].position.x == fieldX && this.activeCreatures[i].position.y == fieldY) {
      return this.activeCreatures[i];
    }
  }
  return null;
}

DW.CreatureHandler.prototype.update = function() {
  // determine target positions to move creatures
  for (var i = 0; i < this.activeCreatures.length; i++) {
    if (this.activeCreatures[i] instanceof DW.Creature) {
      if (this.activeCreatures[i].loadMovementTargetPosition() === true) {
        this.activeCreatures[i].movement.path = this.game.map.calculatePath(
          this.activeCreatures[i].position, this.activeCreatures[i].movement.targetPosition
        );
        this.game.display.moveCreature(this.activeCreatures[i]);
      }
    }
  }
}