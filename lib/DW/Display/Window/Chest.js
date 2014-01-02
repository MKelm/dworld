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

DW.DisplayWindowChest = function(game, width, height) {
  DW.DisplayWindow.call(this, game, 600, 400);
  this.handle = "chest";
  this.title = "Chest";
  this.hint = "Hint: Click on a chest item to collect it.";
  this.tableContents = [];
  this.currentChest = null;
}

DW.DisplayWindowChest.prototype = Object.create(DW.DisplayWindow.prototype);
DW.DisplayWindowChest.prototype.constructor = DW.DisplayWindowChest;

DW.DisplayWindowChest.prototype.show = function() {
  DW.DisplayWindow.prototype.show.call(this);
  this.drawTable(6, 10, 50, 50);
}