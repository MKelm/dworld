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

DW.Creature = function(game, type, x, y) {
  this.position = { x: x, y: y };
  this.type = type;
  this.id = -1;
  this.game = game;

  this.movement = null;
  this.resetMovement();

  this.handle = null;
  this.speed = -1;
  this.health = -1;
  this.strength = -1;
  this.dexterity = 0.4; // todo: add dexterity calculation later

  switch (this.type) {
    case 0: // bug
      this.handle = "bug";
      this.speed = 20;
      this.health = 10;
      this.strength = 1;
      break;
    case 1: // nuao
      this.handle = "nuao";
      this.speed = 30;
      this.health = 20;
      this.strength = 2;
      break;
  }

  this.gfx = null;
}

DW.Creature.prototype.constructor = DW.Creature;

DW.Creature.prototype.makeStrike = function() {
  if (dw.util.isChance(this.dexterity)) {
    return this.strength; // simple: strength == damage
  }
  return 0;
}

DW.Creature.prototype.setStrike = function(damage) {
  this.health = this.health - damage;
}

DW.Creature.prototype.resetMovement = function() {
  this.movement = {
    path: null,
    targetPosition: null,
    lastUpdate: 0,
    stop: false
  };
}

DW.Creature.prototype.loadMovementTargetPosition = function() {
  // load new movement target position if no animation is in progress
  var animationTime = 1000 * (50 / this.speed) + 100;
  if (this.movement.stop === false &&
      (this.movement.lastUpdate === 0 || this.movement.lastUpdate + animationTime < dw.util.time())) {
    // get a target position by random angle and field distance
    var alpha = Math.random() * 360, d = Math.random() * 5;
    var yD = Math.sin(alpha) * d;
    var xD = Math.cos(alpha) * d;
    var tX = this.position.x + Math.round(xD), tY = this.position.y + Math.round(yD);
    // max min x/y depends on map size, recursive operation if no valid target
    if (tX < 0 || tX > this.game.map.fieldAmount.x - 1 || tY < 0 || tY > this.game.map.fieldAmount.y - 1)
      return false;
    this.movement.targetPosition = { x: tX, y: tY };
    return true;
  }
  return false;
}