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

DW.ChestHandler = function() {

  this.activeChests = [];
}

DW.ChestHandler.prototype.constructor = DW.ChestHandler;

DW.ChestHandler.prototype.addChest = function(fieldX, fieldY) {
  this.activeChests.push(new DW.Chest(fieldX, fieldY));
}

DW.ChestHandler.prototype.getChestByPosition = function(fieldX, fieldY) {
  for (var i = 0; i < this.activeChests.length; i++) {
    if (this.activeChests[i].position.x == fieldX && this.activeChests[i].position.y == fieldY) {
      return this.activeChests[i];
    }
  }
  return null;
}