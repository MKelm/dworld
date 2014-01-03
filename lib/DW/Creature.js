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

DW.Creature = function(type, x, y) {
  this.position = { x: x, y: y };
  this.type = type;
  this.id = -1;
  this.move = false;
  this.movePath = null;
  this.moveTargetPosition = null;

  this.handle = null;
  this.speed = -1;
  this.hitPoints = -1;
  this.attackPoints = -1;
  this.dexterity = 0.4; // todo: add dexterity calculation later

  switch (this.type) {
    case 0: // bug
      this.handle = "bug";
      this.speed = 20;
      this.hitPoints = 10;
      this.attackPoints = 1;
      break;
  }

  this.gfx = null;
}

DW.Creature.prototype.constructor = DW.Creature;

DW.Creature.prototype.makeHit = function() {
  if (dw.util.isChance(this.dexterity)) {
    return this.attackPoints;
  }
  return 0;
}

DW.Creature.prototype.setHit = function(attackPoints) {
  this.hitPoints = this.hitPoints - attackPoints;
}

DW.Creature.prototype.resetMove = function() {
  this.move = false;
  this.movePath = null;
  this.moveTargetPosition = null;
}

DW.Creature.prototype.loadMoveTargetPosition = function() {
  // get a target position by random angle and field distance
  if (this.move == false) {
    var alpha = Math.random() * 360, d = Math.random() * 5;;
    var yD = Math.sin(alpha) * d;
    var xD = Math.cos(alpha) * d;
    var tX = this.position.x + Math.round(xD), tY = this.position.y + Math.round(yD);
    // max min x/y depends on map size, recursive operation if no valid target
    if (tX < 0 || tX > 29 || tY < 0 || tY > 29) return this.loadMoveTargetPosition();
    this.moveTargetPosition = { x: tX, y: tY };
    return true;
  }
  return false;
}