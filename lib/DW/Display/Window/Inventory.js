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

DW.DisplayWindowInventory = function(game) {
  DW.DisplayWindow.call(this, game, 600, 400);
  this.handle = "inventory";
  this.title = "Inventory";
  this.hint = "Hint: Left click on item to use, right click to drop.";
  this.tableContent = [];
}

DW.DisplayWindowInventory.prototype = Object.create(DW.DisplayWindow.prototype);
DW.DisplayWindowInventory.prototype.constructor = DW.DisplayWindowInventory;

DW.DisplayWindowInventory.prototype.show = function() {
  DW.DisplayWindow.prototype.show.call(this);
  // update table contents by inventory, todo used item support
  this.tableContent = this.game.player.inventory.content;
  this.drawTable(6, 10, 50, 50);
  // add table highlight function to show items in use, like sword / amor ...
}