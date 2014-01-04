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

DW.Player = function() {
  this.position = { x: -1, y: -1 };
  this.speed = 100;

  this.mana = 50;
  this.maxMana = this.mana;
  this.health = 50;
  this.maxHealth = this.health;

  this.strength = 2; // todo: more complex attack points calculation
  this.dexterity = 0.5; // todo: add dexterity calculation later
  this.movement = false;

  this.inventory = new DW.PlayerInventory(this);

  this.gfx = null;
}

DW.Player.prototype.constructor = DW.Player;

DW.Player.prototype.makeStrike = function() {
  if (dw.util.isChance(this.dexterity)) {
    return this.strength; // simple: strength == damage
  }
  return 0;
}

DW.Player.prototype.setStrike = function(damage) {
  this.health = this.health - damage;
}

DW.Player.prototype.addHealth = function(value) {
  this.health += value;
  if (this.health > this.maxHealth) this.health = this.maxHealth;
}

DW.Player.prototype.addMana = function(value) {
  this.mana += value;
  if (this.mana > this.maxMana) this.mana = this.maxMana;
}